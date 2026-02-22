// animations.js - Jiaobei throw animations with random landing & tumble

const Animations = {
  blockLeft: null,
  blockRight: null,
  stage: null,

  init() {
    this.blockLeft = document.getElementById('block-left');
    this.blockRight = document.getElementById('block-right');
    this.stage = document.getElementById('jiaobei-stage');
  },

  // Hide blocks (jiaobei are "in the user's hands")
  reset() {
    if (!this.blockLeft || !this.blockRight) return;

    this.blockLeft.classList.remove('visible');
    this.blockRight.classList.remove('visible');
    this.stage.classList.remove('landing');

    this.blockLeft.querySelector('.block-inner').getAnimations().forEach(a => a.cancel());
    this.blockRight.querySelector('.block-inner').getAnimations().forEach(a => a.cancel());
    this.blockLeft.querySelector('.block-inner').style.transform = '';
    this.blockRight.querySelector('.block-inner').style.transform = '';
  },

  async throwBlocks(result) {
    this.reset();
    void this.blockLeft.offsetWidth;

    // Show blocks — they appear from center and fly out
    this.blockLeft.classList.add('visible');
    this.blockRight.classList.add('visible');

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Random landing positions across entire screen
    const pad = 60;
    const land1 = this._randomPos(vw, vh, pad);
    const land2 = this._randomPos(vw, vh, pad);
    this._ensureSeparation(land1, land2, 140);

    // Blocks start at center of screen (their default position)
    // Offsets = landing pos minus center
    const cx = vw / 2 - 30; // block margin-left is -30px
    const cy = vh / 2 - 60; // block margin-top is -60px
    const off1 = { x: land1.x - cx, y: land1.y - cy };
    const off2 = { x: land2.x - cx, y: land2.y - cy };

    // Random tumble
    const spin1 = this._randomSpin();
    const spin2 = this._randomSpin();

    // Determine which face lands up
    let leftFlipX, rightFlipX;
    switch (result) {
      case 'holy':
        leftFlipX = this._snapFace(spin1.totalX, 'flat');
        rightFlipX = this._snapFace(spin2.totalX, 'round');
        break;
      case 'laugh':
        leftFlipX = this._snapFace(spin1.totalX, 'round');
        rightFlipX = this._snapFace(spin2.totalX, 'round');
        break;
      case 'negative':
        leftFlipX = this._snapFace(spin1.totalX, 'flat');
        rightFlipX = this._snapFace(spin2.totalX, 'flat');
        break;
    }

    const duration = 1400;
    const easing = 'cubic-bezier(0.22, 0.8, 0.36, 1)';

    const leftInner = this.blockLeft.querySelector('.block-inner');
    const rightInner = this.blockRight.querySelector('.block-inner');

    const anim1 = leftInner.animate(
      this._buildKeyframes(off1, spin1, leftFlipX),
      { duration, easing, fill: 'forwards' }
    );

    const anim2 = rightInner.animate(
      this._buildKeyframes(off2, spin2, rightFlipX),
      { duration: duration + 80, easing, fill: 'forwards' }
    );

    await Promise.all([anim1.finished, anim2.finished]);

    this.stage.classList.add('landing');
    await this._delay(400);
    this.stage.classList.remove('landing');
  },

  // Arc trajectory with tumble and bounce
  // rotateY only during flight for dynamism, resets to 0 on landing so shape stays clean
  _buildKeyframes(off, spin, finalFlipX) {
    const peakY = -220 - Math.random() * 100;
    const rz = spin.rotZ;
    const my = spin.midY;

    return [
      {
        transform: 'translateX(0) translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
        offset: 0
      },
      {
        transform: `translateX(${off.x * 0.15}px) translateY(${peakY * 0.6}px) rotateX(${spin.totalX * 0.3}deg) rotateY(${my * 0.6}deg) rotateZ(${rz * 0.2}deg)`,
        offset: 0.2
      },
      {
        transform: `translateX(${off.x * 0.35}px) translateY(${peakY}px) rotateX(${spin.totalX * 0.55}deg) rotateY(${my}deg) rotateZ(${rz * 0.45}deg)`,
        offset: 0.35
      },
      {
        transform: `translateX(${off.x * 0.65}px) translateY(${off.y * 0.4}px) rotateX(${spin.totalX * 0.8}deg) rotateY(${my * 0.5}deg) rotateZ(${rz * 0.7}deg)`,
        offset: 0.55
      },
      {
        transform: `translateX(${off.x * 0.9}px) translateY(${off.y + 6}px) rotateX(${finalFlipX}deg) rotateY(0deg) rotateZ(${rz}deg)`,
        offset: 0.75
      },
      {
        transform: `translateX(${off.x * 0.97}px) translateY(${off.y - 14}px) rotateX(${finalFlipX}deg) rotateY(0deg) rotateZ(${rz}deg)`,
        offset: 0.85
      },
      {
        transform: `translateX(${off.x}px) translateY(${off.y + 3}px) rotateX(${finalFlipX}deg) rotateY(0deg) rotateZ(${rz}deg)`,
        offset: 0.93
      },
      {
        transform: `translateX(${off.x}px) translateY(${off.y}px) rotateX(${finalFlipX}deg) rotateY(0deg) rotateZ(${rz}deg)`,
        offset: 1
      },
    ];
  },

  _randomSpin() {
    return {
      totalX: 720 + Math.floor(Math.random() * 3) * 360,
      midY: (Math.random() - 0.5) * 80, // only during flight, resets to 0 on landing
      rotZ: (Math.random() - 0.5) * 40,
    };
  },

  _snapFace(rawX, face) {
    const turns = Math.round(rawX / 360);
    return face === 'flat' ? turns * 360 : turns * 360 + 180;
  },

  _randomPos(vw, vh, pad) {
    return {
      x: pad + Math.random() * (vw - pad * 2 - 60),
      y: pad + Math.random() * (vh - pad * 2 - 120),
    };
  },

  _ensureSeparation(a, b, min) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < min) {
      const angle = Math.atan2(dy, dx) || Math.random() * Math.PI * 2;
      b.x = a.x + Math.cos(angle) * min;
      b.y = a.y + Math.sin(angle) * min;
    }
  },

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
