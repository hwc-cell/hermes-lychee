import { useEffect, useState } from "react";

/**
 * Returns `false` when the browser window / Electron window loses focus
 * (user switches to another app). Pausing background timers while the
 * window is blurred avoids idle CPU overheating on macOS (#845).
 */
export function useWindowFocused(): boolean {
  const [focused, setFocused] = useState(
    typeof document !== "undefined" ? document.hasFocus() : true,
  );

  useEffect(() => {
    const onFocus = (): void => setFocused(true);
    const onBlur = (): void => setFocused(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return focused;
}
