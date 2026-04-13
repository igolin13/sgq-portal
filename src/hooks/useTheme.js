import { useState, useEffect } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("sgq-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sgq-theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}
