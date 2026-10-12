(() => {
  "use strict";
  if (globalThis.__blurBeGoneMinimalHookInstalled) return;
  globalThis.__blurBeGoneMinimalHookInstalled = true;

  const COPY_EVENTS = new Set([
    "contextmenu", "selectstart", "dragstart", "copy", "cut", "paste",
    "beforecopy", "beforecut", "beforepaste"
  ]);
  const COPY_KEYS = new Set(["c", "x", "v"]);

  function isEditableTarget(target) {
    return target instanceof Element && (
      target.matches("input, textarea, select, [contenteditable=''], [contenteditable='true']") ||
      Boolean(target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']"))
    );
  }

  function isCopyProtectionEvent(event) {
    if (!(event instanceof Event) || isEditableTarget(event.target)) return false;
    if (COPY_EVENTS.has(event.type)) return true;
    return (event.type === "keydown" || event.type === "keypress") &&
      (event.ctrlKey || event.metaKey) && COPY_KEYS.has(String(event.key).toLowerCase());
  }

  // 这是唯一的页面全局钩子。它保留其他事件的原生行为，
  // 不读取、收集或传输页面数据。
  const nativePreventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function() {
    if (isCopyProtectionEvent(this)) return;
    return nativePreventDefault.call(this);
  };
})();
