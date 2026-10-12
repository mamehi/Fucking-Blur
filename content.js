(() => {
  "use strict";

  const STYLE_ID = "blur-be-gone-runtime-style";
  const SHADOW_STYLE_ID = "blur-be-gone-shadow-style";
  const AD_TITLE = "서드 파티 광고 콘텐츠";
  const INLINE_PROPERTIES = [
    "filter", "-webkit-filter", "backdrop-filter", "-webkit-backdrop-filter",
    "user-select", "-webkit-user-select", "-moz-user-select"
  ];
  const REMOVAL_GUARD = Symbol("blurBeGoneRemovalGuard");

  function installRuntimeStyle(root = document) {
    if (!root?.head || root.getElementById(STYLE_ID)) return;
    const style = root.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `*, *::before, *::after {
      filter: none !important; -webkit-filter: none !important;
      backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
      user-select: text !important; -webkit-user-select: text !important;
      -moz-user-select: text !important; -webkit-touch-callout: default !important;
    }`;
    root.head.appendChild(style);
  }

  function removeMarkedElement(element) {
    if (!(element instanceof Element) || element[REMOVAL_GUARD]) return false;
    if (element.getAttribute("title") !== AD_TITLE) return false;
    if (element === document.documentElement || element === document.body) return false;
    element[REMOVAL_GUARD] = true;
    element.remove();
    return true;
  }

  function fixInlineStyles(element) {
    if (!(element instanceof Element)) return;
    if (removeMarkedElement(element)) return;
    for (const property of INLINE_PROPERTIES) {
      const value = element.style.getPropertyValue(property);
      if (!value) continue;
      const replacement = property.includes("user-select") ? "text" : "none";
      if (value !== replacement || element.style.getPropertyPriority(property) !== "important") {
        element.style.setProperty(property, replacement, "important");
      }
    }
  }

  function installShadowStyle(shadowRoot) {
    if (shadowRoot.querySelector?.(`#${SHADOW_STYLE_ID}`)) return;
    const style = document.createElement("style");
    style.id = SHADOW_STYLE_ID;
    style.textContent = `*, *::before, *::after {
      filter: none !important; -webkit-filter: none !important;
      backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
      user-select: text !important; -webkit-user-select: text !important;
      -moz-user-select: text !important; -webkit-touch-callout: default !important;
    }`;
    shadowRoot.prepend(style);
  }

  function scanElement(element) {
    if (!(element instanceof Element)) return;
    if (removeMarkedElement(element)) return;
    fixInlineStyles(element);
    if (element.shadowRoot) {
      installShadowStyle(element.shadowRoot);
      scanRoot(element.shadowRoot);
    }
    element.querySelectorAll("*").forEach((child) => {
      if (removeMarkedElement(child)) return;
      fixInlineStyles(child);
      if (child.shadowRoot) {
        installShadowStyle(child.shadowRoot);
        scanRoot(child.shadowRoot);
      }
    });
  }

  function scanRoot(root) {
    if (!root) return;
    if (root instanceof Document) installRuntimeStyle(root);
    root.querySelectorAll?.("*").forEach((element) => {
      if (element instanceof Element) scanElement(element);
    });
  }

  function processAddedNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) scanElement(node);
  }

  installRuntimeStyle(document);
  if (document.documentElement) scanElement(document.documentElement);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") mutation.addedNodes.forEach(processAddedNode);
      else if (mutation.type === "attributes" && mutation.target instanceof Element) {
        if (mutation.attributeName === "title") removeMarkedElement(mutation.target);
        else fixInlineStyles(mutation.target);
      }
    }
  });

  observer.observe(document.documentElement || document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["style", "class", "title"]
  });
})();
