(() => {
  const MEDIA_SELECTOR = "img, picture, video, canvas, svg, image-slot";
  const BLOCKED_KEY = new Set(["s", "p"]);

  const hasBackgroundImage = (el) => {
    if (!(el instanceof Element)) return false;
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== "none";
  };

  const mediaFromEvent = (event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (node.matches(MEDIA_SELECTOR) || hasBackgroundImage(node)) return node;
    }
    const target = event.target instanceof Element ? event.target : null;
    return target ? target.closest(MEDIA_SELECTOR) : null;
  };

  const lockMedia = (root = document) => {
    root.querySelectorAll?.(MEDIA_SELECTOR).forEach((el) => {
      el.setAttribute("draggable", "false");
      el.addEventListener("dragstart", (event) => event.preventDefault(), { capture: true });
    });
  };

  const preventMediaAction = (event) => {
    if (mediaFromEvent(event)) event.preventDefault();
  };

  const style = document.createElement("style");
  style.textContent = `
    img, picture, video, canvas, svg, image-slot,
    .decorative {
      -webkit-user-drag: none !important;
      user-drag: none !important;
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }
  `;
  document.head.appendChild(style);

  lockMedia();
  document.addEventListener("DOMContentLoaded", () => lockMedia(), { once: true });
  document.addEventListener("contextmenu", preventMediaAction, { capture: true });
  document.addEventListener("dragstart", preventMediaAction, { capture: true });
  document.addEventListener("selectstart", preventMediaAction, { capture: true });
  document.addEventListener("mousedown", (event) => {
    if (event.button === 2) preventMediaAction(event);
  }, { capture: true });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && BLOCKED_KEY.has(key)) {
      event.preventDefault();
    }
  }, { capture: true });

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) lockMedia(node);
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
