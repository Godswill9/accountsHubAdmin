// Keeps a page's data fresh without a manual refresh: re-runs `load` every few seconds while the tab is
// visible, and immediately when the user comes back to the tab. Use inside useEffect: `load(); return live(load);`
// shortcut: polling, not push. If request volume grows, switch to socket.io (already a backend dependency).
export const LIVE_MS = 5000;

export const live = (load: () => unknown, ms = LIVE_MS) => {
  const tick = () => {
    if (!document.hidden) load();
  };
  const id = setInterval(tick, ms);
  document.addEventListener("visibilitychange", tick);
  return () => {
    clearInterval(id);
    document.removeEventListener("visibilitychange", tick);
  };
};
