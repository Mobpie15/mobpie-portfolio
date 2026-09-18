/**
 * Mobpie 3D WebGL Engine — Clean Obsidian Canvas
 * Wireframe rings removed to eliminate background visual clutter
 */
(function() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
})();
