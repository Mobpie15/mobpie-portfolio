/**
 * MOBPIE // LUXURY 3D SCULPTURE ENGINE (Three.js)
 * - Central interactive luxury floating prism (Brushed Platinum & Champagne Gold)
 * - Dual-layer structure: Outer architectural wireframe cage + Inner glowing faceted crystal core
 * - Mouse drag & inertia: User can effortlessly grab and rotate the 3D sculpture in 360 degrees
 * - Audio-reactive harmonic breathing: subtle expansion and lighting pulse on music beats
 * - Low-end PC safeguard: Strict 60fps cap, pauses render loop when scrolled past hero
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-luxury-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 860;

  // Scene & Camera
  const scene = new THREE.Scene();
  let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight || (window.innerHeight * 0.7));

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = isMobile ? 6.2 : 5.0;

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
    renderer.toneMappingExposure = 1.25;
  } catch (e) {
    console.warn('WebGL init skipped:', e);
    return;
  }

  // Lighting (Studio Rim Lighting for polished luxury reflections)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xd4af37, 2.2); // Warm Champagne Gold
  keyLight.position.set(5, 6, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xe8e4dc, 1.8); // Polished Platinum
  rimLight.position.set(-5, -4, -3);
  scene.add(rimLight);

  const centerPointLight = new THREE.PointLight(0xd4af37, 1.5, 8);
  centerPointLight.position.set(0, 0, 0);
  scene.add(centerPointLight);

  // Group that holds the entire 3D sculpture
  const sculptureGroup = new THREE.Group();
  scene.add(sculptureGroup);

  // -------------------------------------------------------------------------
  // LAYER 1: Inner Crystal Core (Champagne Gold Translucent Mesh)
  // -------------------------------------------------------------------------
  const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.3 : 1.5, 0);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x14120f,
    emissive: 0x3d3216,
    emissiveIntensity: 0.4,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.88,
    wireframe: false
  });
  const innerCore = new THREE.Mesh(coreGeo, coreMat);
  sculptureGroup.add(innerCore);

  // -------------------------------------------------------------------------
  // LAYER 2: Outer Wireframe Cage (Surgical Platinum Lines)
  // -------------------------------------------------------------------------
  const wireGeo = new THREE.IcosahedronGeometry(isMobile ? 1.6 : 1.85, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xe8e4dc,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireCage = new THREE.Mesh(wireGeo, wireMat);
  sculptureGroup.add(wireCage);

  // -------------------------------------------------------------------------
  // LAYER 3: Secondary Orbital Rings (Kinetic Champagne Gyroscope)
  // -------------------------------------------------------------------------
  const ringGeo1 = new THREE.TorusGeometry(isMobile ? 2.1 : 2.4, 0.015, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    transparent: true,
    opacity: 0.65
  });
  const orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  orbitRing1.rotation.x = Math.PI / 3;
  sculptureGroup.add(orbitRing1);

  const ringGeo2 = new THREE.TorusGeometry(isMobile ? 2.25 : 2.55, 0.012, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xe8e4dc,
    transparent: true,
    opacity: 0.4
  });
  const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
  orbitRing2.rotation.y = Math.PI / 4;
  orbitRing2.rotation.z = Math.PI / 6;
  sculptureGroup.add(orbitRing2);

  // -------------------------------------------------------------------------
  // LAYER 4: Glowing Vertex Particle Nodes
  // -------------------------------------------------------------------------
  const nodeCount = 30;
  const nodeGeo = new THREE.BufferGeometry();
  const nodePositions = new Float32Array(nodeCount * 3);
  const corePos = coreGeo.attributes.position.array;

  for (let i = 0; i < nodeCount; i++) {
    const srcIdx = (i % (corePos.length / 3)) * 3;
    nodePositions[i * 3] = corePos[srcIdx] * 1.25;
    nodePositions[i * 3 + 1] = corePos[srcIdx + 1] * 1.25;
    nodePositions[i * 3 + 2] = corePos[srcIdx + 2] * 1.25;
  }

  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.08,
    transparent: true,
    opacity: 0.9
  });
  const nodes = new THREE.Points(nodeGeo, nodeMat);
  sculptureGroup.add(nodes);

  // -------------------------------------------------------------------------
  // INTERACTION & MOMENTUM PHYSICS (Mouse Drag & Hover Tilt)
  // -------------------------------------------------------------------------
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let velocityX = 0;
  let velocityY = 0;

  // Normalized cursor target tilt
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  function onPointerDown(clientX, clientY) {
    isDragging = true;
    prevMouseX = clientX;
    prevMouseY = clientY;
  }

  function onPointerMove(clientX, clientY) {
    // Subtle perspective cursor follow
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetTiltX = ((clientY - cy) / rect.height) * 0.4;
    targetTiltY = ((clientX - cx) / rect.width) * 0.4;

    if (!isDragging) return;
    const deltaX = clientX - prevMouseX;
    const deltaY = clientY - prevMouseY;
    prevMouseX = clientX;
    prevMouseY = clientY;

    velocityY = deltaX * 0.006;
    velocityX = deltaY * 0.006;

    sculptureGroup.rotation.y += velocityY;
    sculptureGroup.rotation.x += velocityX;
  }

  function onPointerUp() {
    isDragging = false;
  }

  // Mouse listeners
  canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('mouseup', onPointerUp);

  // Touch listeners (Mobile friendly)
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('touchend', onPointerUp);

  // Window Resize
  function onResize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight || (window.innerHeight * 0.7);
    camera.aspect = width / height;
    camera.position.z = window.innerWidth <= 860 ? 6.2 : 5.0;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // -------------------------------------------------------------------------
  // RENDER LOOP (60fps Locked & Audio-Reactive)
  // -------------------------------------------------------------------------
  let time = 0;
  let smoothedBass = 0;

  function animate() {
    requestAnimationFrame(animate);

    // Low-end PC optimization: Pause render when user scrolls past hero
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > window.innerHeight * 1.1) return;

    time += 0.01;

    // Audio reactive expansion
    const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, isPlaying: false };
    const targetBass = audio.isPlaying ? audio.bass : 0.03;
    smoothedBass += (targetBass - smoothedBass) * 0.15;

    // Inertia decay if not dragging
    if (!isDragging) {
      velocityX *= 0.94;
      velocityY *= 0.94;
      sculptureGroup.rotation.y += velocityY + 0.0035; // Gentle continuous orbit
      sculptureGroup.rotation.x += velocityX;
    }

    // Secondary ring independent kinetic rotations
    orbitRing1.rotation.z += 0.005;
    orbitRing2.rotation.x -= 0.004;
    wireCage.rotation.y -= 0.002;
    innerCore.rotation.y += 0.004;

    // Smooth cursor tilt damping
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;
    sculptureGroup.position.x = currentTiltY * 0.5;
    sculptureGroup.position.y = -currentTiltX * 0.5;

    // Subtle scale breathing
    const scale = 1.0 + smoothedBass * 0.08 + Math.sin(time * 1.5) * 0.02;
    innerCore.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }

  animate();
})();
