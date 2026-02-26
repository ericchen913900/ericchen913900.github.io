<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  let mountEl: HTMLDivElement;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountEl.appendChild(renderer.domElement);

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext("2d");
    if (!ctx) {
      return () => {
        renderer.dispose();
      };
    }

    const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
    gradient.addColorStop(0, "#04253c");
    gradient.addColorStop(0.45, "#0a3f56");
    gradient.addColorStop(1, "#041a2a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    for (let i = 0; i < 140; i++) {
      const x = Math.random() * textureCanvas.width;
      const y = Math.random() * textureCanvas.height;
      const r = 10 + Math.random() * 36;
      ctx.fillStyle = `rgba(120, 244, 224, ${0.03 + Math.random() * 0.08})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(185, 255, 246, 0.18)";
    ctx.lineWidth = 1;
    for (let y = 0; y < textureCanvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(textureCanvas.width, y);
      ctx.stroke();
    }

    const earthTexture = new THREE.CanvasTexture(textureCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const globeGeometry = new THREE.SphereGeometry(2.6, 96, 96);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.68,
      metalness: 0.22,
      emissive: new THREE.Color("#0bb8a8"),
      emissiveIntensity: 0.13,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(2.66, 40, 30),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#88ffe8"),
        transparent: true,
        opacity: 0.21,
        wireframe: true,
      }),
    );

    scene.add(globe);
    scene.add(wire);

    const ambient = new THREE.AmbientLight(0x4cefd6, 0.5);
    const keyLight = new THREE.PointLight(0xc8fff4, 1.55, 40);
    keyLight.position.set(7, 4, 10);
    const rimLight = new THREE.PointLight(0x40b6ff, 1.2, 36);
    rimLight.position.set(-7, -2, -8);
    scene.add(ambient, keyLight, rimLight);

    let pointerX = 0;
    let pointerY = 0;
    const pointerHandler = (event: PointerEvent) => {
      const rect = mountEl.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    mountEl.addEventListener("pointermove", pointerHandler);

    let frame = 0;
    const resize = () => {
      const width = Math.max(220, mountEl.clientWidth);
      const height = Math.max(220, mountEl.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mountEl);
    resize();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      globe.rotation.y += 0.0062;
      wire.rotation.y += 0.0077;
      wire.rotation.x += 0.0016;
      globe.rotation.x = THREE.MathUtils.lerp(globe.rotation.x, pointerY * 0.18, 0.05);
      globe.rotation.z = THREE.MathUtils.lerp(globe.rotation.z, -pointerX * 0.16, 0.05);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mountEl.removeEventListener("pointermove", pointerHandler);
      scene.remove(globe, wire, ambient, keyLight, rimLight);
      globeGeometry.dispose();
      globeMaterial.dispose();
      earthTexture.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  });
</script>

<div class="globe-root" bind:this={mountEl} aria-label="Rotating globe"></div>

<style>
  .globe-root {
    width: min(44vw, 30rem);
    height: min(44vw, 30rem);
    min-width: 13.5rem;
    min-height: 13.5rem;
    border-radius: 9999px;
    background: radial-gradient(circle at 45% 38%, rgba(145, 255, 238, 0.16), rgba(5, 20, 30, 0.2) 56%, transparent 72%);
    box-shadow:
      0 0 0 1px rgba(167, 255, 237, 0.22),
      0 24px 70px -34px rgba(9, 196, 175, 0.8),
      inset 0 -28px 66px rgba(2, 7, 10, 0.58);
    overflow: hidden;
  }

  .globe-root :global(canvas) {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (max-width: 768px) {
    .globe-root {
      width: min(72vw, 21rem);
      height: min(72vw, 21rem);
      margin-inline: auto;
    }
  }
</style>
