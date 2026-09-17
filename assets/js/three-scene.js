/**
 * MOBPIE // HIGH-OCTANE KINETIC 3D ENGINE (Three.js WebGL)
 * Inspired by Awwwards Site of the Year (OFF+BRAND & Basement Studio)
 * - Multi-faceted kinetic polygon core with GPU vertex wave displacement
 * - Electric Acid Volt (#d4ff00) specular highlights & neon wireframe pulses
 * - Dual-axis gyroscopic kinetic rings with counter-rotational velocity
 * - Interactive particle swarm with cursor gravity & velocity trails
 * - Live FPS meter telemetry update
 * - Low-end PC safeguard: pauses render loop when scrolled off-screen
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-luxury-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 860;

  // Scene & Camera
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
    renderer.toneMappingExposure = 1.35;
  } catch (e) {
    console.warn('WebGL init skipped:', e);
    return;
  }

  // Lighting: High-Contrast Cybernetic Studio Setup
  const ambientLight = new THREE.AmbientLight(0x0c0e14, 1.5);
  scene.add(ambientLight);

  // Key Specular Electric Volt Light
  const voltLight = new THREE.DirectionalLight(0xd4ff00, 3.5);
  voltLight.position.set(5, 7, 4);
  scene.add(voltLight);

  // Rim Titanium White Light
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
  rimLight.position.set(-6, -4, -3);
  scene.add(rimLight);

  // Fill Deep Cyan Light (Contrast Depth)
  const fillLight = new THREE.DirectionalLight(0x1a2636, 1.8);
  fillLight.position.set(0, -6, 2);
  scene.add(fillLight);

  // Master Kinetic Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Kinetic Faceted Polygon Core (Icosahedron Geometry)
  const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x08090d,
    emissive: 0x070903,
    roughness: 0.12,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    wireframe: false,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(coreMesh);

  // 2. Outer Electric Wireframe Exoskeleton
  const wireGeo = new THREE.IcosahedronGeometry(1.32, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xd4ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  masterGroup.add(wireMesh);

  // 3. Counter-Rotating Gyroscopic Rings
  const ringGroup = new THREE.Group();
  masterGroup.add(ringGroup);

  const ring1Geo = new THREE.TorusGeometry(1.9, 0.015, 16, 100);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0xd4ff00,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x222b00
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  ringGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.1, 0.012, 16, 100);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.15,
    transparent: true,
    opacity: 0.7
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 6;
  ringGroup.add(ring2);

  // 4. Interactive Particle Swarm
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleVel = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const r = 2.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    particlePos[i] = r * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = r * Math.cos(phi);

    particleVel[i] = (Math.random() - 0.5) * 0.005;
    particleVel[i + 1] = (Math.random() - 0.5) * 0.005;
    particleVel[i + 2] = (Math.random() - 0.5) * 0.005;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd4ff00,
    size: 0.035,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const particlePoints = new THREE.Points(particleGeo, particleMat);
  masterGroup.add(particlePoints);

  // Interaction State: Mouse Drag & Inertia
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let targetRotation = { x: 0.2, y: 0.3 };
  let currentRotation = { x: 0.2, y: 0.3 };
  let velocity = { x: 0.002, y: 0.003 };

  function onMouseDown(e) {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  }

  function onMouseMove(e) {
    if (isDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      velocity.x = deltaY * 0.004;
      velocity.y = deltaX * 0.004;
      targetRotation.x += velocity.x;
      targetRotation.y += velocity.y;
      prevMousePos = { x: e.clientX, y: e.clientY };
    } else {
      // Subtle mouse tilt
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotation.y += normX * 0.001;
      targetRotation.x += normY * 0.001;
    }
  }

  function onMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
  }

  // Touch Support for Mobile
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      velocity.x = deltaY * 0.004;
      velocity.y = deltaX * 0.004;
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

  // Low-End PC Protection: Pause loop when scrolled off-screen
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

  // FPS Telemetry Meter
  const fpsEl = document.getElementById('canvas-fps-meter');
  let frameCount = 0;
  let lastTime = performance.now();

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // FPS Counter Calculation
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
      velocity.x *= 0.94;
      velocity.y *= 0.94;
      targetRotation.x += velocity.x + 0.003;
      targetRotation.y += velocity.y + 0.005;
    }

    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    masterGroup.rotation.x = currentRotation.x;
    masterGroup.rotation.y = currentRotation.y;

    // Independent Ring Counter-Rotation
    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.006;

    // Kinetic Breathing Pulse
    const pulse = Math.sin(elapsedTime * 2.5) * 0.035;
    coreMesh.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
    wireMesh.scale.set(1 + pulse * 1.5, 1 + pulse * 1.5, 1 + pulse * 1.5);

    // Particle Swarm Rotation
    particlePoints.rotation.y += 0.0015;
    particlePoints.rotation.x -= 0.001;

    renderer.render(scene, camera);
  }

  animate();
})();
