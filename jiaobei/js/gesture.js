// gesture.js - MediaPipe HandLandmarker for two-hand grab/release detection

const GestureSystem = {
  handLandmarker: null,
  videoElement: null,
  isRunning: false,
  lastFrameTime: -1,
  _frameSkip: 0,

  // Hand states
  leftHand: 'none',   // none | grab | open
  rightHand: 'none',

  // Confirmed combined state (debounced)
  currentState: 'none',      // none | holding | released
  confirmedState: 'none',
  stateStartTime: 0,
  debounceMs: 180,

  // Callbacks
  onStateChange: null,  // (newState, prevState) => {}

  async init(videoEl) {
    this.videoElement = videoEl;

    const { HandLandmarker, FilesetResolver } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs'
    );

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
    );

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = -1;
    this.leftHand = 'none';
    this.rightHand = 'none';
    this.currentState = 'none';
    this.confirmedState = 'none';
    this._detect();
  },

  stop() {
    this.isRunning = false;
  },

  _detect() {
    if (!this.isRunning || !this.handLandmarker || !this.videoElement) return;

    this._frameSkip++;
    if (this._frameSkip < 3) {
      requestAnimationFrame(() => this._detect());
      return;
    }
    this._frameSkip = 0;

    const now = performance.now();
    if (this.videoElement.readyState >= 2 && now !== this.lastFrameTime) {
      const results = this.handLandmarker.detectForVideo(this.videoElement, now);
      this.lastFrameTime = now;
      this._processResults(results);
    }

    requestAnimationFrame(() => this._detect());
  },

  _processResults(results) {
    if (!results.landmarks || results.landmarks.length === 0) {
      this.leftHand = 'none';
      this.rightHand = 'none';
      this._updateState('none');
      return;
    }

    // Reset before processing
    let left = 'none';
    let right = 'none';

    for (let i = 0; i < results.landmarks.length; i++) {
      const landmarks = results.landmarks[i];
      const handedness = results.handednesses[i]?.[0]?.categoryName;
      const gesture = this._classifyGesture(landmarks);

      // MediaPipe handedness is from camera's perspective (mirrored)
      // "Left" from camera = user's right hand, and vice versa
      if (handedness === 'Left') {
        right = gesture;
      } else {
        left = gesture;
      }
    }

    this.leftHand = left;
    this.rightHand = right;

    // Determine combined state
    if (this.leftHand === 'grab' && this.rightHand === 'grab') {
      this._updateState('holding');
    } else if (
      (this.leftHand === 'open' || this.leftHand === 'point') &&
      (this.rightHand === 'open' || this.rightHand === 'point')
    ) {
      this._updateState('released');
    } else if (this.leftHand === 'none' && this.rightHand === 'none') {
      this._updateState('none');
    } else {
      // Partial state — one hand grab one hand open, or one detected
      // Keep current state to avoid flicker
    }
  },

  _classifyGesture(landmarks) {
    const fingers = this._getFingerStates(landmarks);
    const extendedCount = fingers.filter(f => f).length;

    if (extendedCount >= 4) return 'open';
    if (extendedCount <= 1 && !fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'grab';
    if (fingers[1] && extendedCount <= 2) return 'point';

    return 'open'; // Default to open for safety
  },

  _getFingerStates(landmarks) {
    const isExtended = [];

    // Thumb
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const wrist = landmarks[0];
    const palmCenterX = (wrist.x + landmarks[9].x) / 2;
    const tipDist = Math.abs(thumbTip.x - palmCenterX);
    const ipDist = Math.abs(thumbIP.x - palmCenterX);
    isExtended.push(tipDist > ipDist);

    // Index, Middle, Ring, Pinky
    const fingerTips = [8, 12, 16, 20];
    const fingerPIPs = [6, 10, 14, 18];
    for (let i = 0; i < 4; i++) {
      isExtended.push(landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y);
    }

    return isExtended;
  },

  _updateState(rawState) {
    if (rawState !== this.currentState) {
      this.currentState = rawState;
      this.stateStartTime = performance.now();
    }

    const elapsed = performance.now() - this.stateStartTime;
    if (elapsed >= this.debounceMs && this.confirmedState !== this.currentState) {
      const prev = this.confirmedState;
      this.confirmedState = this.currentState;
      if (this.onStateChange) {
        this.onStateChange(this.confirmedState, prev);
      }
    }
  },

  destroy() {
    this.stop();
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
  }
};
