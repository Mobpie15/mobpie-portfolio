/**
 * MOBPIE // AWWWARDS MASTERPIECE 3D WEBGL ENGINE (v40.0)
 * Aesthetic: Liquid Mercury, Interactive Specular Torchlight, Spatial Morphing
 * Features:
 * 1. Living Liquid Mercury Mesh with Real-Time Vertex Displacement
 * 2. Interactive Cursor Torchlight tracking 3D pointer coordinates
 * 3. Counter-rotating Astrolabe Titanium Rings
 * 4. Spatial Coordinate Particle Constellation
 * 5. Project-Adaptive Topology & Lighting Morphing (Atelier / Amazon / Piebot / Exploit)
 * 6. Smooth Parallax & Mouse Drag Orbit Physics
 * 7. Low-End PC Hardware Protection (Capped DPR, auto-pause when hidden)
 */

(function () {
  'use strict';

  function initMasterpiece3D() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.12);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.0);

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
      renderer.toneMappingExposure = 1.35;
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    // 3. Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0a0e17, 1.8);
    scene.add(ambientLight);

    // Key Light: Pure Specular Platinum
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Ethereal Rim Light: Cool Lunar Cyan
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimLight.position.set(-5, -3, -3);
    scene.add(rimLight);

    // Dynamic Cursor Torchlight: Moves with user pointer in 3D
    const torchLight = new THREE.PointLight(0xffffff, 5.5, 9.0);
    torchLight.position.set(0, 0, 2.5);
    scene.add(torchLight);

    // 4. Master Geometry Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Living Liquid Mercury Mesh (Icosahedron with subdivision)
    const liquidGeo = new THREE.IcosahedronGeometry(1.35, 4);
    
    // Store original rest positions for mathematical displacement
    const posAttr = liquidGeo.attributes.position;
    const vertexCount = posAttr.count;
    const origPositions = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount * 3; i++) {
      origPositions[i] = posAttr.array[i];
    }

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c101a,
      emissive: 0x03060c,
      roughness: 0.1,
      metalness: 0.96,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
      flatShading: false
    });

    const liquidMesh = new THREE.Mesh(liquidGeo, chromeMat);
    masterGroup.add(liquidMesh);

    // B. Delicate Wireframe Exoskeleton
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wireMesh = new THREE.Mesh(liquidGeo, wireMat);
    masterGroup.add(wireMesh);

    // C. Astrolabe Titanium Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    const ring1Geo = new THREE.TorusGeometry(1.85, 0.012, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.009, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    ringGroup.add(ring2);

    // D. Particle Constellation
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pPositions[i * 3 + 1] = radius * Math.sin(phi);
      pPositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.032,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleMesh);

    // 5. Interactive Mouse Orbit, Drag & Torchlight
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let rippleTurbulence = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
      rippleTurbulence = Math.min(1.0, rippleTurbulence + 0.08);

      // Move 3D Torchlight smoothly to cursor projection
      torchLight.position.x = mouseX * 3.2;
      torchLight.position.y = -mouseY * 2.2;
      torchLight.position.z = 2.4;
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('a, button, input, select, textarea, .theater-tab-btn')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      rippleTurbulence = 1.0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      dragRotY += deltaX * 0.005;
      dragRotX += deltaY * 0.005;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      rippleTurbulence = 1.0;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('a, button, input, select, textarea, .theater-tab-btn')) return;
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        rippleTurbulence = 1.0;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      dragRotY += deltaX * 0.006;
      dragRotX += deltaY * 0.006;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // 6. Project-Adaptive Morphing States
    let currentMorph = 'hero';
    let morphFrequency = 2.2;
    let morphSpeed = 1.6;
    let targetMeshColor = new THREE.Color(0x0c101a);
    let targetRimColor = new THREE.Color(0x38bdf8);

    window.setProjectMorph = function (morphKey) {
      currentMorph = morphKey;
      rippleTurbulence = 1.2;

      if (morphKey === 'atelier') {
        // Haute Couture: Silk liquid drape, warm gold rim
        morphFrequency = 1.6;
        morphSpeed = 1.2;
        targetMeshColor.setHex(0x14100c);
        targetRimColor.setHex(0xf0d58a);
        wireMat.color.setHex(0xf0d58a);
        wireMat.opacity = 0.25;
      } else if (morphKey === 'amazon') {
        // High-Ticket Retail: Clean obsidian crystal
        morphFrequency = 3.2;
        morphSpeed = 1.8;
        targetMeshColor.setHex(0x0a0c10);
        targetRimColor.setHex(0xffffff);
        wireMat.color.setHex(0xffffff);
        wireMat.opacity = 0.15;
      } else if (morphKey === 'piebot') {
        // Distributed WebSocket: Fast pulsating cluster
        morphFrequency = 4.2;
        morphSpeed = 2.5;
        targetMeshColor.setHex(0x06121a);
        targetRimColor.setHex(0x00f2fe);
        wireMat.color.setHex(0x00f2fe);
        wireMat.opacity = 0.35;
      } else if (morphKey === 'exploit') {
        // Protocol Audit: High-frequency data matrix
        morphFrequency = 5.0;
        morphSpeed = 3.0;
        targetMeshColor.setHex(0x0a1410);
        targetRimColor.setHex(0x4ade80);
        wireMat.color.setHex(0x4ade80);
        wireMat.opacity = 0.4;
      } else {
        // Default Hero State
        morphFrequency = 2.2;
        morphSpeed = 1.6;
        targetMeshColor.setHex(0x0c101a);
        targetRimColor.setHex(0x38bdf8);
        wireMat.color.setHex(0xffffff);
        wireMat.opacity = 0.12;
      }
    };

    // 7. Scroll Choreography
    let scrollProgress = 0;
    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 8. Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 9. Hardware Safeguard
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    // 10. Main Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Damped mouse tracking
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.3 - targetY) * 0.05;

      // Base idle spin
      masterGroup.rotation.y += delta * 0.25;
      masterGroup.rotation.x += delta * 0.12;

      // Drag inertia
      masterGroup.rotation.y += dragRotY;
      masterGroup.rotation.x += dragRotX;
      dragRotX *= 0.94;
      dragRotY *= 0.94;

      // Mouse Parallax
      masterGroup.position.x = targetX * 0.5;
      masterGroup.position.y = -targetY * 0.35;

      // Counter-rotating Astrolabe Rings
      ring1.rotation.z += delta * 0.35;
      ring1.rotation.x += delta * 0.2;
      ring2.rotation.y -= delta * 0.4;
      ring2.rotation.z += delta * 0.25;

      // Particle Field Wave
      particleMesh.rotation.y -= delta * 0.06;

      // Smooth color morphing
      chromeMat.color.lerp(targetMeshColor, 0.05);
      rimLight.color.lerp(targetRimColor, 0.05);

      // LIVING LIQUID MERCURY VERTEX DISPLACEMENT
      rippleTurbulence *= 0.96;
      const waveAmp = 0.15 + rippleTurbulence * 0.18;
      const curPositions = posAttr.array;

      for (let i = 0; i < vertexCount; i++) {
        const i3 = i * 3;
        const ox = origPositions[i3];
        const oy = origPositions[i3 + 1];
        const oz = origPositions[i3 + 2];

        // 3D Organic Sinusoidal Ripple Wave
        const wave = Math.sin(ox * morphFrequency + time * morphSpeed) *
                     Math.cos(oy * morphFrequency + time * (morphSpeed * 0.9)) *
                     Math.sin(oz * morphFrequency + time * (morphSpeed * 1.1));

        const dist = 1.0 + wave * waveAmp;

        curPositions[i3] = ox * dist;
        curPositions[i3 + 1] = oy * dist;
        curPositions[i3 + 2] = oz * dist;
      }

      posAttr.needsUpdate = true;
      liquidMesh.geometry.computeVertexNormals();

      // Scroll Position Transition
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        if (scrollProgress < 0.2) {
          // Hero
          masterGroup.position.x += (0 - masterGroup.position.x) * 0.08;
          camera.position.z = 5.0;
        } else if (scrollProgress < 0.65) {
          // Works
          masterGroup.position.x += (1.45 - masterGroup.position.x) * 0.08;
          camera.position.z = 5.4;
        } else if (scrollProgress < 0.85) {
          // Expertise
          masterGroup.position.x += (-1.35 - masterGroup.position.x) * 0.08;
          camera.position.z = 5.2;
        } else {
          // Contact
          masterGroup.position.x += (0 - masterGroup.position.x) * 0.08;
          masterGroup.position.y += (0.6 - masterGroup.position.y) * 0.08;
          camera.position.z = 5.6;
        }
      } else {
        masterGroup.position.x = 0;
        camera.position.z = 6.2;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasterpiece3D);
  } else {
    initMasterpiece3D();
  }
})();
