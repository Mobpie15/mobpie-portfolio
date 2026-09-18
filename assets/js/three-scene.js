/**
 * MOBPIE // SENSIBLE 3D SPATIAL CYBER-DECK & PROJECT ENGINE
 * Awwwards-Level 3D Holographic Display Terminal.
 * 
 * Design Soul:
 * - NO random geometric wireframe blobs.
 * - Represents Mobpie's architectural project terminal in 3D space.
 * - Dynamic PBR glass screen projecting live high-resolution canvas textures of Mobpie's real flagships.
 * - Interactive mouse drag orbit with spring inertia physics.
 * - Project switching smoothly crossfades textures with digital scanline wipe.
 * - Auto-pauses render loop via IntersectionObserver when offscreen (0% CPU/GPU overhead).
 */

(function () {
  'use strict';

  let renderer, scene, camera, deviceGroup;
  let screenMesh, screenCanvas, screenCtx, screenTexture;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotX = 0.12;
  let targetRotY = -0.32;
  let currentRotX = 0.12;
  let currentRotY = -0.32;
  let baseRotY = 0;
  let isVisible = true;
  let rafId = null;
  let activeSlide = 0;
  let scanlineAlpha = 0;

  // Project Display Data for 3D Screen Canvas
  const projectSlides = [
    {
      id: 'atelier',
      badge: 'FLAGSHIP 01 // QUIET LUXURY',
      title: 'ATELIER ORA',
      category: 'Haute Couture Boutique',
      kpi: '12 Curated Silhouettes &bull; Travertine Minimalist Grid',
      accent: '#dfcfb3',
      bgTone: '#0d0f12',
      metrics: ['CONVERSION: +148%', 'RENDER: 480FPS', 'AESTHETIC: LUXURY']
    },
    {
      id: 'amazon',
      badge: 'FLAGSHIP 02 // E-COMMERCE REMAKE',
      title: 'AMAZON LUXURY',
      category: 'Enterprise Storefront Redesign',
      kpi: 'Zero Clutter &bull; High-Velocity Checkout &bull; Editorial PDP',
      accent: '#ffffff',
      bgTone: '#080a0f',
      metrics: ['RETENTION: +92%', 'BOUNCE RATE: -41%', 'DESIGN: BESPOKE']
    },
    {
      id: 'piebot',
      badge: 'FLAGSHIP 03 // DISCORD ENGINE',
      title: 'PIEBOT CORE',
      category: 'High-Concurrence Infrastructure',
      kpi: 'Multi-Server Automation &bull; Real-Time Socket Telemetry',
      accent: '#38bdf8',
      bgTone: '#060911',
      metrics: ['SOCKET: 18MS', 'UPTIME: 99.98%', 'SERVERS: 25+']
    },
    {
      id: 'creator',
      badge: 'FLAGSHIP 04 // DATA ARCHITECTURE',
      title: 'EXPLOIT HUB',
      category: 'Gaming Creator Platform',
      kpi: '46 Videos Audited &bull; GTA 5 & Minecraft Exploit Matrix',
      accent: '#ff4d00',
      bgTone: '#110705',
      metrics: ['CTR PEAK: 8.5%', 'WATCH TIME: 66%', 'STRATEGY: LOCKED']
    }
  ];

  // Dynamic 2D Canvas Generator for 3D PBR Screen
  function createScreenTexture() {
    screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    screenCtx = screenCanvas.getContext('2d');

    drawProjectToScreen(0, 0);

    screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 8;
    screenTexture.generateMipmaps = true;
    return screenTexture;
  }

  function drawProjectToScreen(index, scanProgress = 0) {
    if (!screenCtx) return;
    const proj = projectSlides[index] || projectSlides[0];

    const w = screenCanvas.width;
    const h = screenCanvas.height;

    // Background Void
    screenCtx.fillStyle = proj.bgTone;
    screenCtx.fillRect(0, 0, w, h);

    // Subtle Grid Lines
    screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    screenCtx.lineWidth = 1;
    for (let x = 40; x < w; x += 60) {
      screenCtx.beginPath();
      screenCtx.moveTo(x, 0);
      screenCtx.lineTo(x, h);
      screenCtx.stroke();
    }
    for (let y = 40; y < h; y += 60) {
      screenCtx.beginPath();
      screenCtx.moveTo(0, y);
      screenCtx.lineTo(w, y);
      screenCtx.stroke();
    }

    // Top Terminal Header Bar
    screenCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    screenCtx.fillRect(40, 40, w - 80, 50);
    screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    screenCtx.strokeRect(40, 40, w - 80, 50);

    // Terminal Status Dots
    screenCtx.fillStyle = '#ff5f56';
    screenCtx.beginPath();
    screenCtx.arc(68, 65, 5, 0, Math.PI * 2);
    screenCtx.fill();
    screenCtx.fillStyle = '#ffbd2e';
    screenCtx.beginPath();
    screenCtx.arc(88, 65, 5, 0, Math.PI * 2);
    screenCtx.fill();
    screenCtx.fillStyle = '#27c93f';
    screenCtx.beginPath();
    screenCtx.arc(108, 65, 5, 0, Math.PI * 2);
    screenCtx.fill();

    // Badge
    screenCtx.font = '600 15px "JetBrains Mono", monospace';
    screenCtx.fillStyle = proj.accent;
    screenCtx.fillText(proj.badge, 140, 71);

    // Live Telemetry Tag
    screenCtx.font = '500 13px "JetBrains Mono", monospace';
    screenCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    screenCtx.textAlign = 'right';
    screenCtx.fillText('STATUS: LIVE PRODUCTION', w - 60, 71);
    screenCtx.textAlign = 'left';

    // Main Showcase Title
    screenCtx.font = '900 68px "Syne", "Cabinet Grotesk", sans-serif';
    screenCtx.fillStyle = '#ffffff';
    screenCtx.fillText(proj.title, 50, 180);

    // Category Kicker
    screenCtx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    screenCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    screenCtx.fillText(proj.category.toUpperCase(), 52, 222);

    // Thin Dividing Line
    screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    screenCtx.beginPath();
    screenCtx.moveTo(50, 255);
    screenCtx.lineTo(w - 50, 255);
    screenCtx.stroke();

    // Description / KPI
    screenCtx.font = '400 21px "Plus Jakarta Sans", sans-serif';
    screenCtx.fillStyle = '#cbd5e1';
    screenCtx.fillText(proj.kpi.replace('&bull;', '•'), 52, 310);

    // Interactive Wireframe Window in Screen
    const wireX = 50;
    const wireY = 350;
    const wireW = w - 100;
    const wireH = 190;

    screenCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    screenCtx.fillRect(wireX, wireY, wireW, wireH);
    screenCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    screenCtx.strokeRect(wireX, wireY, wireW, wireH);

    // Metrics Columns inside Wireframe
    proj.metrics.forEach((metric, i) => {
      const colX = wireX + 30 + i * (wireW / 3);
      const colY = wireY + 60;

      screenCtx.font = '700 13px "JetBrains Mono", monospace';
      screenCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      screenCtx.fillText(`METRIC [0${i + 1}]`, colX, colY);

      screenCtx.font = '800 24px "Syne", sans-serif';
      screenCtx.fillStyle = proj.accent;
      screenCtx.fillText(metric.split(':')[1] || metric, colX, colY + 38);

      screenCtx.font = '500 12px "JetBrains Mono", monospace';
      screenCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      screenCtx.fillText(metric.split(':')[0] || 'DATA', colX, colY + 68);
    });

    // Bottom Navigation Bar in Screen
    screenCtx.font = '600 14px "JetBrains Mono", monospace';
    screenCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    screenCtx.fillText('INTERACTIVE 3D DECK // DRAG TO ROTATE // CLICK TABS TO SWITCH', 50, h - 45);

    screenCtx.fillStyle = proj.accent;
    screenCtx.fillRect(w - 180, h - 60, 130, 26);
    screenCtx.font = '700 12px "JetBrains Mono", monospace';
    screenCtx.fillStyle = '#000000';
    screenCtx.fillText('EXPLORE WORK', w - 165, h - 43);

    // Scanline wipe effect during switch
    if (scanProgress > 0) {
      screenCtx.fillStyle = `rgba(255, 255, 255, ${0.35 * (1 - scanProgress)})`;
      const scanY = h * scanProgress;
      screenCtx.fillRect(0, scanY - 20, w, 40);
    }

    if (screenTexture) {
      screenTexture.needsUpdate = true;
    }
  }

  function initThreeScene() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // 2. WebGL Renderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
    } catch (e) {
      console.warn('WebGL initialization error:', e);
      return;
    }

    // 3. Dynamic Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-4, -2, -2);
    scene.add(rimLight);

    const torchLight = new THREE.PointLight(0xffffff, 3.0, 7.0);
    torchLight.position.set(0, 0, 3.0);
    scene.add(torchLight);

    // 4. Build Sensible 3D Architectural Device (Cyber-Deck)
    deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // A. Titanium Chassis (Beveled Rounded Box)
    const chassisGeo = new THREE.BoxGeometry(2.35, 1.58, 0.12);
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x12161f,
      emissive: 0x05070a,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    deviceGroup.add(chassisMesh);

    // B. Delicate Titanium Border Chamfer
    const chamferGeo = new THREE.BoxGeometry(2.37, 1.60, 0.08);
    const chamferMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    const chamferMesh = new THREE.Mesh(chamferGeo, chamferMat);
    deviceGroup.add(chamferMesh);

    // C. PBR Dynamic Glass Screen
    const screenGeo = new THREE.PlaneGeometry(2.22, 1.46);
    const screenTex = createScreenTexture();
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: screenTex,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95
    });
    screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.065;
    deviceGroup.add(screenMesh);

    // D. Tactile Control Bar Accent at Base
    const barGeo = new THREE.BoxGeometry(0.6, 0.04, 0.04);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.4
    });
    const barMesh = new THREE.Mesh(barGeo, barMat);
    barMesh.position.set(0, -0.72, 0.07);
    deviceGroup.add(barMesh);

    // E. Delicate Coordinate Grid in 3D Depth
    const gridHelper = new THREE.GridHelper(6, 12, 0x222938, 0x111622);
    gridHelper.position.y = -1.2;
    gridHelper.position.z = -0.5;
    scene.add(gridHelper);

    // Initial group placement
    deviceGroup.rotation.x = currentRotX;
    deviceGroup.rotation.y = currentRotY;

    // 5. Drag & Orbit Interaction Listeners
    const heroContainer = document.getElementById('hero-canvas-container') || canvas;

    function onPointerDown(e) {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      if (window.MobpieAudio) window.MobpieAudio.playClick(1400, 0.02);
    }

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      // Update torchlight relative to mouse in 3D
      const rect = canvas.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((clientY - rect.top) / rect.height) * 2 + 1;
      torchLight.position.x = normX * 2.5;
      torchLight.position.y = normY * 1.8;

      if (!isDragging) {
        // Subtle ambient parallax
        targetRotY = -0.32 + normX * 0.22;
        targetRotX = 0.12 - normY * 0.18;
        return;
      }

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.007;

      // Clamp X rotation so it doesn't flip upside down
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
    }

    heroContainer.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    heroContainer.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Double click to reset orientation
    heroContainer.addEventListener('dblclick', function () {
      targetRotX = 0.12;
      targetRotY = -0.32;
      if (window.MobpieAudio) window.MobpieAudio.playClick(1100, 0.03);
    });

    // 6. Resize Handler
    function onResize() {
      if (!canvas || !renderer || !camera) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    }
    window.addEventListener('resize', onResize);

    // 7. Hardware Safeguard: Pause RAF when off-screen
    const heroSection = document.getElementById('hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            rafId = requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    // 8. Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      if (!isVisible) {
        rafId = null;
        return;
      }

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Spring Orbit Physics
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      // Subtle breathing float animation
      const floatY = Math.sin(elapsedTime * 1.2) * 0.035;
      deviceGroup.position.y = floatY;

      deviceGroup.rotation.x = currentRotX;
      deviceGroup.rotation.y = currentRotY;

      // Render
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
  }

  // Project Slide Switcher on 3D Device Screen
  function switchProjectSlide(index) {
    if (index === activeSlide) return;
    activeSlide = index;

    if (window.MobpieAudio) {
      window.MobpieAudio.playSwitch();
    }

    // Dynamic scanline transition on 3D canvas
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.15;
      drawProjectToScreen(activeSlide, progress);
      if (progress >= 1.0) {
        clearInterval(interval);
        drawProjectToScreen(activeSlide, 0);
      }
    }, 20);

    // Micro recoil spring on 3D device
    targetRotX += 0.04;
    setTimeout(() => { targetRotX -= 0.04; }, 140);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }

  window.Mobpie3D = {
    switchSlide: switchProjectSlide,
    getActiveSlide: () => activeSlide
  };
})();
