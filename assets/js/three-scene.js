/**
 * MOBPIE // MINIMALIST 3D WEBGL ENGINE (v30.0)
 * Aesthetic: Deep Obsidian Void, Liquid Chrome, Lunar Specular Lighting
 * Features:
 * - Floating Liquid-Chrome Sculptural Core (Physical Metallic Shader)
 * - Concentric Ethereal Wireframe Exoskeleton
 * - Spatial Coordinate Particle Constellation (250 nodes)
 * - Interactive Mouse Drift & Click-and-Drag Orbit Physics
 * - Smooth Scroll-Driven Spatial Choreography (Hero -> Works -> Expertise -> Contact)
 * - Low-End PC Hardware Protection (Capped DPR, auto-pause when hidden)
 */

(function () {
  'use strict';

  function initMinimal3D() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.12);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 2. WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    // 3. Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0c1017, 1.5);
    scene.add(ambientLight);

    // Key Specular Light: Pure Platinum White
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Ethereal Rim Light: Cool Lunar Cyan
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    rimLight.position.set(-5, -3, -3);
    scene.add(rimLight);

    // Warm Titanium Fill Light
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.4);
    fillLight.position.set(0, -4, 3);
    scene.add(fillLight);

    // 4. Master Geometry Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Sculptural Liquid Chrome Centerpiece (Torus Knot)
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.32, 128, 28, 2, 3);
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f131c,
      emissive: 0x020408,
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      flatShading: false
    });
    const chromeMesh = new THREE.Mesh(knotGeo, chromeMat);
    masterGroup.add(chromeMesh);

    // B. Delicate Wireframe Exoskeleton
    const wireGeo = new THREE.TorusKnotGeometry(1.18, 0.33, 64, 16, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // C. Ethereal Particle Constellation
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      scales[i] = Math.random() * 0.03 + 0.01;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleMesh);

    // 5. Interactive Mouse Orbit & Dragging
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;

    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      // Don't drag if clicking buttons or links
      if (e.target.closest('a, button, input, select, textarea')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      dragRotationY += deltaX * 0.005;
      dragRotationX += deltaY * 0.005;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('a, button, input, select, textarea')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      dragRotationY += deltaX * 0.006;
      dragRotationX += deltaY * 0.006;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // 6. Smooth Scroll Choreography
    let scrollProgress = 0;

    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 7. Window Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 8. Low-End PC Hardware Protection
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    // 9. Main Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      // Mouse damping interpolation
      targetX += (mouseX * 0.45 - targetX) * 0.05;
      targetY += (mouseY * 0.35 - targetY) * 0.05;

      // Base idle spin
      masterGroup.rotation.y += delta * 0.25;
      masterGroup.rotation.x += delta * 0.1;

      // Apply drag rotation with spring damping
      masterGroup.rotation.y += dragRotationY;
      masterGroup.rotation.x += dragRotationX;
      dragRotationX *= 0.94;
      dragRotationY *= 0.94;

      // Parallax mouse tilt
      masterGroup.position.x = targetX * 0.6;
      masterGroup.position.y = -targetY * 0.4;

      // Scroll choreography:
      // Hero (0.0): Center, scale 1.0
      // Works (0.2 - 0.5): Shifts to right (x: 1.4), scale 0.9
      // Expertise (0.5 - 0.8): Shifts back to left (x: -1.2), rotates faster
      // Contact (0.8 - 1.0): Floats high center (y: 0.8), scale 0.8
      const isMobile = window.innerWidth < 768;
      
      if (!isMobile) {
        if (scrollProgress < 0.25) {
          // Hero Zone
          const t = scrollProgress / 0.25;
          camera.position.z = 5.2 + t * 0.5;
          masterGroup.position.x += (0 - masterGroup.position.x) * 0.08;
        } else if (scrollProgress < 0.6) {
          // Works Zone
          const t = (scrollProgress - 0.25) / 0.35;
          const targetPosX = 1.35;
          masterGroup.position.x += (targetPosX - masterGroup.position.x) * 0.08;
          camera.position.z = 5.7 - t * 0.3;
        } else if (scrollProgress < 0.85) {
          // Expertise Zone
          const targetPosX = -1.2;
          masterGroup.position.x += (targetPosX - masterGroup.position.x) * 0.08;
        } else {
          // Contact Zone
          masterGroup.position.x += (0 - masterGroup.position.x) * 0.08;
          masterGroup.position.y += (0.6 - masterGroup.position.y) * 0.08;
        }
      } else {
        // Mobile: Keep centered, subtle depth shift
        camera.position.z = 6.2;
        masterGroup.position.x = 0;
      }

      // Orbital Particle rotation
      particleMesh.rotation.y -= delta * 0.08;
      wireMesh.rotation.z += delta * 0.15;

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinimal3D);
  } else {
    initMinimal3D();
  }
})();
