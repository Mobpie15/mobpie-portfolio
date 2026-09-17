/**
 * MOBPIE // HERO 3D COCKPIT ENGINE (Three.js WebGL)
 * Aesthetic: Ice Azure (#00f2fe), Prismatic Titanium (#ffffff), Celestial Obsidian (#07090e)
 * - Interactive 3D Icosahedron Core with metallic chrome finish
 * - Counter-rotating gyroscopic astrolabe rings
 * - 600-point interactive cyan/white particle cloud
 * - 3 Interactive visual modes: SOLID CORE, WIREFRAME MATRIX, PARTICLE VORTEX
 * - Hardware safeguard: IntersectionObserver automatically pauses rendering when scrolled away
 */

(function () {
  'use strict';

  function initHero3D() {
    const canvas = document.getElementById('hero-3d-canvas');
    const container = document.getElementById('hero-3d-stage');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    let width = container.clientWidth || 460;
    let height = container.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.8);

    // 2. WebGL Renderer
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
      renderer.toneMappingExposure = 1.3;
    } catch (e) {
      console.warn('WebGL initialization skipped:', e);
      return;
    }

    // 3. Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.8);
    scene.add(ambientLight);

    // Key Light: Electric Ice Azure
    const keyAzure = new THREE.DirectionalLight(0x00f2fe, 4.2);
    keyAzure.position.set(4, 6, 5);
    scene.add(keyAzure);

    // Rim Light: Pure Specular White
    const rimWhite = new THREE.DirectionalLight(0xffffff, 3.2);
    rimWhite.position.set(-5, -4, -3);
    scene.add(rimWhite);

    // Deep Cobalt Fill Light
    const fillCobalt = new THREE.DirectionalLight(0x1e3a8a, 2.0);
    fillCobalt.position.set(0, -5, 3);
    scene.add(fillCobalt);

    // 4. Geometry Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Faceted Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x080d1a,
      emissive: 0x020814,
      roughness: 0.12,
      metalness: 0.94,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // B. Outer Electric Cyan Wireframe Exoskeleton
    const wireGeo = new THREE.IcosahedronGeometry(1.32, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // C. Gyroscopic Astrolabe Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Ring 1 (Azure)
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.016, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.3
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ringGroup.add(ring1);

    // Ring 2 (Titanium White)
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.014, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0xffffff,
      emissiveIntensity: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring2);

    // D. Particle Swarm (600 glowing particles)
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2.2 + Math.random() * 1.6;

      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);

      // Gradient between Azure (#00f2fe) and Pure White (#ffffff)
      if (Math.random() > 0.4) {
        colorArray[i * 3] = 0.0;
        colorArray[i * 3 + 1] = 0.95;
        colorArray[i * 3 + 2] = 1.0;
      } else {
        colorArray[i * 3] = 1.0;
        colorArray[i * 3 + 1] = 1.0;
        colorArray[i * 3 + 2] = 1.0;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
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
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.style.cursor = 'grabbing';
      if (window.audioEngine) window.audioEngine.playActionThud();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;
        masterGroup.rotation.y += dragVelocityX;
        masterGroup.rotation.x += dragVelocityY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetX = relX * 0.45;
        targetY = relY * 0.45;
      }

      // Track specular light position with mouse
      keyAzure.position.x = 4 + relX * 3;
      keyAzure.position.y = 6 - relY * 3;
    });

    // Touch Support
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        masterGroup.rotation.y += deltaX * 0.006;
        masterGroup.rotation.x += deltaY * 0.006;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    // 6. Interactive Mode Switcher
    window.setHero3DMode = function (mode, btn) {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      if (mode === 'solid') {
        coreMesh.visible = true;
        wireMesh.visible = true;
        wireMesh.material.opacity = 0.35;
        particleMesh.visible = true;
        particleMesh.material.opacity = 0.6;
        ringGroup.visible = true;
      } else if (mode === 'wire') {
        coreMesh.visible = false;
        wireMesh.visible = true;
        wireMesh.material.opacity = 0.85;
        ringGroup.visible = true;
        particleMesh.visible = false;
      } else if (mode === 'particles') {
        coreMesh.visible = false;
        wireMesh.visible = false;
        ringGroup.visible = false;
        particleMesh.visible = true;
        particleMesh.material.opacity = 1.0;
        particleMesh.material.size = 0.048;
      }

      if (window.audioEngine) window.audioEngine.playActionThud();
    };

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth || 460;
      height = container.clientHeight || 460;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 8. Low-End PC Hardware Protection: IntersectionObserver
    let isRendering = true;
    let animId = null;

    if ('IntersectionObserver' in window) {
      const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isRendering = entry.isIntersecting;
          if (isRendering && !animId) {
            clock.start();
            animId = requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.1 });
      viewObserver.observe(container);
    }

    // 9. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      if (!isRendering) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        // Smooth rotation momentum
        masterGroup.rotation.y += (targetX - masterGroup.rotation.y * 0.1) * 0.05 + 0.004;
        masterGroup.rotation.x += (targetY - masterGroup.rotation.x * 0.1) * 0.05;

        // Counter-rotating astrolabe rings
        ring1.rotation.z += delta * 0.45;
        ring1.rotation.x += delta * 0.25;
        ring2.rotation.z -= delta * 0.35;
        ring2.rotation.y += delta * 0.3;

        // Particle field wave rotation
        particleMesh.rotation.y -= delta * 0.08;
      }

      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
