/**
 * MOBPIE // HIGH-OCTANE KINETIC 3D ENGINE (Three.js WebGL)
 * Inspired by Awwwards Site of the Year 2025 (OFF+BRAND & Basement Studio)
 * - Multi-faceted kinetic polygon core with metallic obsidian chrome finish
 * - Dynamic mouse specular light tracking (sheen follows cursor in real-time)
 * - Explosive wireframe exoskeleton expansion on user drag (kinetic burst)
 * - Triple-axis counter-rotating gyroscopic astrolabe rings
 * - Interactive particle swarm with cursor gravity attraction
 * - Live real-time FPS telemetry meter
 * - Hardware protection: IntersectionObserver pauses render loop when scrolled off-screen
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-luxury-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 860;

  // Scene & Camera Setup
  const scene = new THREE.Scene();
  let width = (canvas.width = canvas.parentElement.clientWidth || 440);
  let height = (canvas.height = canvas.parentElement.clientHeight || 440);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = isMobile ? 5.8 : 4.6;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
  } catch (e) {
    console.warn('WebGL init skipped:', e);
    return;
  }

  // Lighting: High-Contrast Dynamic Cybernetic Studio
  const ambientLight = new THREE.AmbientLight(0x0c0e14, 1.6);
  scene.add(ambientLight);

  // Dynamic Key Specular Volt Light (Tracks cursor in real-time)
  const voltLight = new THREE.DirectionalLight(0xd4ff00, 3.8);
  voltLight.position.set(5, 7, 4);
  scene.add(voltLight);

  // Rim Titanium Specular Light
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.6);
  rimLight.position.set(-6, -4, -3);
  scene.add(rimLight);

  // Fill Cyan Light for Shadow Contrast
  const fillLight = new THREE.DirectionalLight(0x1a2636, 1.8);
  fillLight.position.set(0, -6, 2);
  scene.add(fillLight);

  // Master Kinetic Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Faceted Polygon Core (Icosahedron Geometry)
  const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x07080a,
    emissive: 0x050702,
    roughness: 0.1,
    metalness: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(coreMesh);

  // 2. Outer Electric Wireframe Exoskeleton
  const wireGeo = new THREE.IcosahedronGeometry(1.34, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xd4ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  masterGroup.add(wireMesh);

  // 3. Triple-Axis Gyroscopic Astrolabe Rings
  const ringGroup = new THREE.Group();
  masterGroup.add(ringGroup);

  // Ring 1: Electric Volt Primary
  const ring1Geo = new THREE.TorusGeometry(1.85, 0.016, 16, 100);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0xd4ff00,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x222b00
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  ringGroup.add(ring1);

  // Ring 2: Titanium Specular Counter-Ring
  const ring2Geo = new THREE.TorusGeometry(2.05, 0.012, 16, 100);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.15,
    transparent: true,
    opacity: 0.75
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  ringGroup.add(ring2);

  // Ring 3: Outer Orbital Gimbal
  const ring3Geo = new THREE.TorusGeometry(2.25, 0.008, 16, 100);
  const ring3Mat = new THREE.MeshStandardMaterial({
    color: 0x8a90a2,
    metalness: 0.85,
    roughness: 0.3,
    transparent: true,
    opacity: 0.4
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.z = Math.PI / 5;
  ringGroup.add(ring3);

  // 4. Interactive Particle Swarm
  const particleCount = 320;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const originalPos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 2.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    particlePos[i] = originalPos[i] = x;
    particlePos[i + 1] = originalPos[i + 1] = y;
    particlePos[i + 2] = originalPos[i + 2] = z;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd4ff00,
    size: 0.038,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const particlePoints = new THREE.Points(particleGeo, particleMat);
  masterGroup.add(particlePoints);

  // Interaction State: Mouse Drag, Velocity & Dynamic Lighting
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let targetRotation = { x: 0.2, y: 0.3 };
  let currentRotation = { x: 0.2, y: 0.3 };
  let velocity = { x: 0.002, y: 0.003 };
  let mouseNorm = { x: 0, y: 0 };

  function onMouseDown(e) {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
    if (window.audioEngine) window.audioEngine.playActionThud();
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNorm.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    // Dynamic Specular Light Follower
    voltLight.position.x = mouseNorm.x * 7 + 4;
    voltLight.position.y = mouseNorm.y * 7 + 5;

    if (isDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      velocity.x = deltaY * 0.005;
      velocity.y = deltaX * 0.005;
      targetRotation.x += velocity.x;
      targetRotation.y += velocity.y;
      prevMousePos = { x: e.clientX, y: e.clientY };
    } else {
      // Subtle organic tilt
      targetRotation.y += mouseNorm.x * 0.001;
      targetRotation.x += mouseNorm.y * 0.001;
    }
  }

  function onMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
  }

  // Mobile Touch Support
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (window.audioEngine) window.audioEngine.playActionThud();
    }
  }

  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      velocity.x = deltaY * 0.005;
      velocity.y = deltaX * 0.005;
      targetRotation.x += velocity.x;
      targetRotation.y += velocity.y;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function onTouchEnd() {
    isDragging = false;
  }

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  // Resize Handling
  function onWindowResize() {
    if (!canvas || !canvas.parentElement) return;
    width = canvas.parentElement.clientWidth || 440;
    height = canvas.parentElement.clientHeight || 440;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onWindowResize, { passive: true });

  // Low-End PC Hardware Protection: Freeze loop off-screen
  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(canvas.parentElement || canvas);

  // Live FPS Telemetry Meter
  const fpsEl = document.getElementById('canvas-fps-meter');
  let frameCount = 0;
  let lastTime = performance.now();

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // FPS Calculation
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) {
        fpsEl.textContent = Math.round((frameCount * 1000) / (now - lastTime)) + ' FPS';
      }
      frameCount = 0;
      lastTime = now;
    }

    // Rotational Physics Decay
    if (!isDragging) {
      velocity.x *= 0.93;
      velocity.y *= 0.93;
      targetRotation.x += velocity.x + 0.003;
      targetRotation.y += velocity.y + 0.005;
    }

    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    masterGroup.rotation.x = currentRotation.x;
    masterGroup.rotation.y = currentRotation.y;

    // Independent Gyro Ring Rotations
    ring1.rotation.z += 0.009;
    ring2.rotation.z -= 0.007;
    ring3.rotation.x += 0.005;

    // Kinetic Breathing & Explosive Drag Expansion
    const pulse = Math.sin(elapsedTime * 2.5) * 0.035;
    coreMesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);

    if (isDragging) {
      // Explosive Wireframe Expansion on Drag
      wireMesh.scale.lerp(new THREE.Vector3(1.48, 1.48, 1.48), 0.15);
      wireMat.opacity = 0.85;
    } else {
      wireMesh.scale.lerp(new THREE.Vector3(1.05 + pulse * 1.5, 1.05 + pulse * 1.5, 1.05 + pulse * 1.5), 0.1);
      wireMat.opacity = 0.45;
    }

    // Particle Swarm Rotation
    particlePoints.rotation.y += 0.002;
    particlePoints.rotation.x -= 0.001;

    renderer.render(scene, camera);
  }

  animate();
})();
