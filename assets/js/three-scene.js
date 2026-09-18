/**
 * MOBPIE // FULL-BLEED CINEMATIC SPATIAL 3D WEBGL ENGINE
 * Edge-to-edge luxury ambient 3D space with liquid specular refraction,
 * floating titanium rings, interactive torchlight, and scroll-reactive depth.
 */

(function () {
  'use strict';

  let renderer, scene, camera, masterGroup, coreMesh, ringsGroup, particles;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0;
  let targetScrollY = 0;
  let torchLight, rimLight;
  let rafId = null;

  function initSpatialEngine() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene & Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.14);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // 3. Renderer
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
      console.warn('WebGL init error:', e);
      return;
    }

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    rimLight = new THREE.DirectionalLight(0xdfcfb3, 2.5);
    rimLight.position.set(-5, -3, -3);
    scene.add(rimLight);

    torchLight = new THREE.PointLight(0xffffff, 4.0, 8.0);
    torchLight.position.set(0, 0, 3.0);
    scene.add(torchLight);

    // 5. Master Geometry Group
    masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Liquid Specular Mercury Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0d14,
      emissive: 0x020408,
      roughness: 0.12,
      metalness: 0.94,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
      wireframe: false
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // B. Delicate Wireframe Outer Shell
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.setScalar(1.02);
    masterGroup.add(wireMesh);

    // C. Floating Titanium Astrolabe Rings
    ringsGroup = new THREE.Group();
    masterGroup.add(ringsGroup);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.012, 16, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.008, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 3;
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.006, 16, 64), ringMat);
    ring3.rotation.y = Math.PI / 4;

    ringsGroup.add(ring1);
    ringsGroup.add(ring2);
    ringsGroup.add(ring3);

    // D. Spatial Star Dust Particles
    const partCount = 180;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);

    for (let i = 0; i < partCount * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 16;
      partPos[i + 1] = (Math.random() - 0.5) * 16;
      partPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));

    const partMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.35
    });
    particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 6. Interaction Listeners
    window.addEventListener('mousemove', function (e) {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('scroll', function () {
      targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    });

    // 7. Render Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Lerp scroll
      scrollY += (targetScrollY - scrollY) * 0.08;

      // Torchlight tracking
      torchLight.position.x = mouseX * 3.5;
      torchLight.position.y = mouseY * 2.5;

      // Rotate 3D Core & Rings
      if (coreMesh) {
        coreMesh.rotation.y = elapsedTime * 0.25 + mouseX * 0.8;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.3 + mouseY * 0.5;
      }

      if (ringsGroup) {
        ringsGroup.children[0].rotation.z = -elapsedTime * 0.3;
        ringsGroup.children[1].rotation.x = elapsedTime * 0.25;
        ringsGroup.children[2].rotation.y = -elapsedTime * 0.18;
      }

      if (particles) {
        particles.rotation.y = elapsedTime * 0.04;
      }

      // Parallax scroll reaction
      const scrollNorm = scrollY / (document.documentElement.scrollHeight || 1);
      masterGroup.position.y = -scrollY * 0.0015;
      masterGroup.position.z = -scrollNorm * 1.5;
      masterGroup.rotation.y = scrollNorm * Math.PI;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
  }

  // Active theme shift
  window.setSpatialTone = function (hexColor) {
    if (rimLight) {
      rimLight.color.setHex(hexColor);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpatialEngine);
  } else {
    initSpatialEngine();
  }
})();
