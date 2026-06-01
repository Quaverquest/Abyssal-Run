(() => {
  // Bail early if WebGL not supported
  if ( !window.WebGLRenderingContext ) return;

  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // Particles
  const particleCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 200; // x
    positions[i3 + 1] = (Math.random() - 0.5) * 120; // y
    positions[i3 + 2] = (Math.random() - 0.5) * 200; // z
    sizes[i] = 1 + Math.random() * 3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Material
  const material = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: 1.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // subtle movement variables
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.002;
    mouseY = (e.clientY - windowHalfY) * 0.002;
  });

  // animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // idle rotation + slow z pulsation
    points.rotation.y = t * 0.03 + targetX * 0.5;
    points.rotation.x = t * 0.01 + targetY * 0.2;

    // nudge target toward mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // responsive
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();
