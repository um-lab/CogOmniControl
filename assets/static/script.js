/* CogOmniControl — minimal interactivity
   - hover-to-play / pause for video media
   - graceful fallback when video sources are missing
   - smart figure: auto-detect svg/png/jpg/pdf for teaser & pipeline
   - sync prompt-card height to its sibling media (preserve aspect ratios)
*/

document.addEventListener('DOMContentLoaded', () => {
  // ---------- hover-to-play preview videos ----------
  document.querySelectorAll('.media-card:not(.output-card) video.media').forEach((v) => {
    const card = v.closest('.media-card');
    card.addEventListener('mouseenter', () => { v.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
  });

  // ---------- video fallback ----------
  document.querySelectorAll('video.media').forEach((v) => {
    const fallback = v.parentElement.querySelector('.media-fallback');
    const showFallback = () => {
      v.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
    };
    v.addEventListener('error', showFallback);
    v.addEventListener('loadedmetadata', () => { if (!v.videoWidth) showFallback(); });
    const src = v.querySelector('source');
    if (src) {
      fetch(src.src, { method: 'HEAD' })
        .then((r) => { if (!r.ok) showFallback(); })
        .catch(showFallback);
    }
  });

  // ---------- sync prompt-card height to sibling media cards ----------
  // For each example, find the tallest non-prompt media card in the inputs row
  // and clamp the prompt-card to that height. The prompt-box scrolls internally.
  const syncPromptHeights = () => {
    document.querySelectorAll('.example .inputs-row').forEach((row) => {
      const prompt = row.querySelector('.prompt-card');
      if (!prompt) return;
      const siblings = row.querySelectorAll('.media-card:not(.prompt-card)');
      if (!siblings.length) {
        prompt.style.height = '';
        return;
      }
      let h = 0;
      siblings.forEach((s) => { h = Math.max(h, s.getBoundingClientRect().height); });
      if (h > 0) {
        prompt.style.height = `${Math.round(h)}px`;
      }
    });
  };

  // Run after assets load, on resize, and whenever any media reports new dimensions.
  const scheduleSync = (() => {
    let t = null;
    return () => {
      if (t) cancelAnimationFrame(t);
      t = requestAnimationFrame(syncPromptHeights);
    };
  })();

  window.addEventListener('load', scheduleSync);
  window.addEventListener('resize', scheduleSync);

  document.querySelectorAll('.media-card:not(.prompt-card) video.media')
    .forEach((v) => v.addEventListener('loadedmetadata', scheduleSync));
  document.querySelectorAll('.media-card:not(.prompt-card) img.media')
    .forEach((img) => {
      if (img.complete) scheduleSync();
      else img.addEventListener('load', scheduleSync);
    });

  // initial pass
  scheduleSync();

  // ---------- smart figure (teaser / pipeline) ----------
  const headOk = (url) =>
    fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && (r.headers.get('content-type') || '').toLowerCase())
      .catch(() => false);

  document.querySelectorAll('.smart-figure').forEach(async (fig) => {
    const base = fig.dataset.src;
    const exts = (fig.dataset.exts || 'svg,png,jpg,jpeg,webp,pdf')
      .split(',').map((s) => s.trim()).filter(Boolean);
    const slot = fig.querySelector('.figure-slot');
    if (!base || !slot) return;

    for (const ext of exts) {
      const url = `${base}.${ext}`;
      const ct = await headOk(url);
      if (!ct) continue;
      mountAsset(slot, url, ext);
      slot.classList.add('has-asset');
      return;
    }
  });

  function mountAsset(slot, url, ext) {
    slot.innerHTML = '';
    const e = ext.toLowerCase();
    if (e === 'pdf') {
      const obj = document.createElement('object');
      obj.type = 'application/pdf';
      obj.data = `${url}#view=FitH&toolbar=0&navpanes=0`;
      obj.setAttribute('aria-label', 'figure');
      const fb = document.createElement('div');
      fb.className = 'figure-placeholder';
      fb.innerHTML = `
        <span>PDF preview is not supported in this browser.</span>
        <small><a href="${url}" target="_blank" rel="noopener">Open ${url}</a></small>`;
      obj.appendChild(fb);
      slot.appendChild(obj);
    } else {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'figure';
      img.loading = 'lazy';
      slot.appendChild(img);
    }
  }
});

