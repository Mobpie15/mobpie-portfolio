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
  // LAYER 1: Liquid Obsidian & Gold Shader Sphere (GPU Wave Displaced)
  // -------------------------------------------------------------------------
  const coreRadius = isMobile ? 1.25 : 1.48;
  const coreGeo = new THREE.SphereGeometry(coreRadius, 64, 64);

  const customUniforms = {
    uTime: { value: 0 },
    uBass: { value: 0 }
  };

  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x09090d,
    emissive: 0x221a08,
    emissiveIntensity: 0.45,
    metalness: 0.92,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.95
  });

  // Inject GPU Vertex Shader Harmonic Wave Displacement
  coreMat.onBeforeCompile = function (shader) {
    shader.uniforms.uTime = customUniforms.uTime;
    shader.uniforms.uBass = customUniforms.uBass;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uBass;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float wave1 = sin(transformed.x * 2.6 + uTime * 2.2) * cos(transformed.y * 2.6 + uTime * 1.8);
      float wave2 = sin(transformed.z * 3.0 + uTime * 1.5) * cos(transformed.x * 3.0 + uTime * 2.0);
      float displacement = (wave1 + wave2) * (0.075 + uBass * 0.15);
      transformed += normal * displacement;
      `
    );
  };

  const innerCore = new THREE.Mesh(coreGeo, coreMat);
  sculptureGroup.add(innerCore);

  // -------------------------------------------------------------------------
  // LAYER 2: Outer Astrolabe Precision Rings (Brushed Platinum & Champagne Gold)
  // -------------------------------------------------------------------------
  const ringGeo1 = new THREE.TorusGeometry(isMobile ? 2.1 : 2.45, 0.016, 16, 120);
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x3d3216,
    emissiveIntensity: 0.25
  });
  const orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  orbitRing1.rotation.x = Math.PI / 3;
  sculptureGroup.add(orbitRing1);

  const ringGeo2 = new THREE.TorusGeometry(isMobile ? 2.3 : 2.7, 0.012, 16, 120);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0xe8e4dc,
    metalness: 0.9,
    roughness: 0.25,
    transparent: true,
    opacity: 0.75
  });
  const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
  orbitRing2.rotation.y = Math.PI / 4;
  orbitRing2.rotation.z = Math.PI / 6;
  sculptureGroup.add(orbitRing2);

  // -------------------------------------------------------------------------
  // LAYER 3: Ambient Stardust Constellation
  // -------------------------------------------------------------------------
  const particleCount = isMobile ? 45 : 90;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = 2.0 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const stardust = new THREE.Points(particleGeo, particleMat);
  sculptureGroup.add(stardust);

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
    if (scrollY > window.innerHeight * 1.05) return;

    time += 0.016;

    // Audio reactive expansion
    const audio = window.getAudioMetrics ? window.getAudioMetrics() : { bass: 0, isPlaying: false };
    const targetBass = audio.isPlaying ? audio.bass : 0.025;
    smoothedBass += (targetBass - smoothedBass) * 0.16;

    // Update GPU vertex shader uniforms
    customUniforms.uTime.value = time;
    customUniforms.uBass.value = smoothedBass;

    // Inertia decay if not dragging
    if (!isDragging) {
      velocityX *= 0.94;
      velocityY *= 0.94;
      sculptureGroup.rotation.y += velocityY + 0.0036; // Gentle continuous orbit
      sculptureGroup.rotation.x += velocityX;
    }

    // Secondary ring independent kinetic rotations
    orbitRing1.rotation.z += 0.006;
    orbitRing2.rotation.x -= 0.005;
    stardust.rotation.y += 0.0015;
    innerCore.rotation.y += 0.003;

    // Smooth cursor tilt damping
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;
    sculptureGroup.position.x = currentTiltY * 0.45;
    sculptureGroup.position.y = -currentTiltX * 0.45;

    // Audio-reactive light glow
    centerPointLight.intensity = 1.5 + smoothedBass * 2.4;

    renderer.render(scene, camera);
  }

  animate();
})();
