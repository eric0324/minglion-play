// gesture.js - MediaPipe HandLandmarker initialization and gesture recognition

const GestureSystem = {
  handLandmarker: null,
  videoElement: null,
  isRunning: false,
  lastFrameTime: -1,
  _frameSkip: 0,

  // Smoothed hand position (normalized 0-1)
  handPos: { x: 0.5, y: 0.5 },
  smoothAlpha: 0.3,

  // Gesture state
  currentGesture: 'none',
  gestureStartTime: 0,
  confirmedGesture: 'none',
  debounceMs: 200,

  // Callbacks
  onGestureChange: null,
  onHandMove: null,

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
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = -1;
    this._detect();
  },

  stop() {
    this.isRunning = false;
  },

  _detect() {
    if (!this.isRunning || !this.handLandmarker || !this.videoElement) return;

    // Process every 3rd frame (~20fps) to reduce CPU/memory usage
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
      this._updateGesture('none');
      return;
    }

    const landmarks = results.landmarks[0];

    // Mirror X for natural interaction
    const indexTip = landmarks[8];
    const mirroredX = 1.0 - indexTip.x;
    const rawY = indexTip.y;

    // Exponential moving average smoothing
    this.handPos.x += this.smoothAlpha * (mirroredX - this.handPos.x);
    this.handPos.y += this.smoothAlpha * (rawY - this.handPos.y);

    if (this.onHandMove) {
      this.onHandMove(this.handPos.x, this.handPos.y);
    }

    const gesture = this._classifyGesture(landmarks);
    this._updateGesture(gesture);
  },

  _classifyGesture(landmarks) {
    const fingers = this._getFingerStates(landmarks);
    const extendedCount = fingers.filter(f => f).length;

    if (extendedCount >= 4) return 'open';
    if (fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'point';
    if (extendedCount <= 1 && !fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'grab';
    if (fingers[1]) return 'point';

    return 'none';
  },

  _getFingerStates(landmarks) {
    const isExtended = [];

    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const wrist = landmarks[0];
    const palmCenterX = (wrist.x + landmarks[9].x) / 2;
    const tipDist = Math.abs(thumbTip.x - palmCenterX);
    const ipDist = Math.abs(thumbIP.x - palmCenterX);
    isExtended.push(tipDist > ipDist);

    const fingerTips = [8, 12, 16, 20];
    const fingerPIPs = [6, 10, 14, 18];
    for (let i = 0; i < 4; i++) {
      isExtended.push(landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y);
    }

    return isExtended;
  },

  _updateGesture(rawGesture) {
    if (rawGesture !== this.currentGesture) {
      this.currentGesture = rawGesture;
      this.gestureStartTime = performance.now();
    }

    const elapsed = performance.now() - this.gestureStartTime;
    if (elapsed >= this.debounceMs && this.confirmedGesture !== this.currentGesture) {
      const prev = this.confirmedGesture;
      this.confirmedGesture = this.currentGesture;
      if (this.onGestureChange) {
        this.onGestureChange(this.confirmedGesture, prev);
      }
    }
  },

  getScreenPos() {
    return {
      x: this.handPos.x * window.innerWidth,
      y: this.handPos.y * window.innerHeight
    };
  },

  destroy() {
    this.stop();
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
  }
};
