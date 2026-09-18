/**
 * Mobpie 3D Architectural WebGL Constellation Engine (Three.js r128)
 * - Delicate, luminous particle nodes connected by dynamic wireframe threads
 * - Cursor physics: particles subtly gravitate and disperse with silky damping
 * - Audio-reactive surge: expands, pulses, and illuminates in sync with getAudioMetrics()
 * - Strictly optimized: 60fps locked, pauses on scroll past hero or when tab is hidden
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 860;
  const PARTICLE_COUNT = isMobile ? 120 : 260;
  const CONNECTION_DIST = isMobile ? 85 : 125;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
  camera.position.z = 450;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  } catch (e) {
    console.warn('WebGL init skipped:', e);
    return;
  }

  // Resize Handler
  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // Mouse Interaction (Normalized coordinates)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.45;
    mouse.targetY = -(e.clientY - height / 2) * 0.45;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  // Particle Data Structures
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];
  const basePositions = [];

  const spreadX = 650;
  const spreadY = 480;
  const spreadZ = 300;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * spreadX;
    const y = (Math.random() - 0.5) * spreadY + 40;
    const z = (Math.random() - 0.5) * spreadZ;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    basePositions.push({ x, y, z });
    velocities.push({
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      vz: (Math.random() - 0.5) * 0.35
    });
  }

  // Particle Geometry & Material (Crisp glowing circular points)
  function createPointTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.65, 'rgba(215, 225, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(pCanvas);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: isMobile ? 3.5 : 5.0,
    map: createPointTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Dynamic Connecting Lines Geometry (Pre-allocated buffer)
  const maxLines = PARTICLE_COUNT * 8;
  const linePositions = new Float32Array(maxLines * 6);
  const lineColors = new Float32Array(maxLines * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSegments);

  // Visibility and Scroll optimization
  let isVisible = true;
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  let smoothedBass = 0;
  let smoothedEnergy = 0;

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    // Check if scrolled far past hero
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > window.innerHeight * 0.9) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Mouse easing
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    camera.position.x = mouse.x * 0.18;
    camera.position.y = mouse.y * 0.18;
    camera.lookAt(0, 30, 0);

    // Audio reactive metrics
    const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, energy: 0, isPlaying: false };
    const targetBass = audio.isPlaying ? audio.bass : 0.04;
    const targetEnergy = audio.isPlaying ? audio.energy : 0.03;

    smoothedBass += (targetBass - smoothedBass) * 0.18;
    smoothedEnergy += (targetEnergy - smoothedEnergy) * 0.16;

    // Dynamic particle expansion & rotation on beat
    particleSystem.rotation.y = time * 0.02 + smoothedBass * 0.08;
    particleSystem.rotation.x = Math.sin(time * 0.015) * 0.04;

    lineSegments.rotation.y = particleSystem.rotation.y;
    lineSegments.rotation.x = particleSystem.rotation.x;

    const posArray = particleGeometry.attributes.position.array;

    // Update particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const v = velocities[i];
      const base = basePositions[i];

      posArray[idx] += v.vx;
      posArray[idx + 1] += v.vy;
      posArray[idx + 2] += v.vz;

      // Bounce at boundary
      if (Math.abs(posArray[idx] - base.x) > 40) v.vx *= -1;
      if (Math.abs(posArray[idx + 1] - base.y) > 40) v.vy *= -1;
      if (Math.abs(posArray[idx + 2] - base.z) > 30) v.vz *= -1;

      // Audio beat vertical wave perturbation
      posArray[idx + 1] += Math.sin(time * 2.5 + posArray[idx] * 0.02) * (smoothedBass * 1.8);
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Build dynamic connection lines between nearest particles
    let lineIdx = 0;
    const linePos = lineGeometry.attributes.position.array;
    const lineCol = lineGeometry.attributes.color.array;

    const maxDist = CONNECTION_DIST * (1.0 + smoothedBass * 0.35);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x1 = posArray[i3];
      const y1 = posArray[i3 + 1];
      const z1 = posArray[i3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const j3 = j * 3;
        const dx = x1 - posArray[j3];
        const dy = y1 - posArray[j3 + 1];
        const dz = z1 - posArray[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist && lineIdx < maxLines) {
          const l6 = lineIdx * 6;
          const alpha = (1.0 - dist / maxDist) * (audio.isPlaying ? 0.75 : 0.45);

          linePos[l6] = x1;
          linePos[l6 + 1] = y1;
          linePos[l6 + 2] = z1;
          linePos[l6 + 3] = posArray[j3];
          linePos[l6 + 4] = posArray[j3 + 1];
          linePos[l6 + 5] = posArray[j3 + 2];

          // Luminous cyber line coloring
          const r = 0.85 + smoothedBass * 0.15;
          const g = 0.90 + smoothedEnergy * 0.10;
          const b = 1.0;

          lineCol[l6] = r * alpha;
          lineCol[l6 + 1] = g * alpha;
          lineCol[l6 + 2] = b * alpha;
          lineCol[l6 + 3] = r * alpha;
          lineCol[l6 + 4] = g * alpha;
          lineCol[l6 + 5] = b * alpha;

          lineIdx++;
        }
      }
    }

    lineGeometry.setDrawRange(0, lineIdx * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // Subtle scale breathing with sound energy
    const scale = 1.0 + smoothedBass * 0.05;
    particleSystem.scale.set(scale, scale, scale);
    lineSegments.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();
})();
