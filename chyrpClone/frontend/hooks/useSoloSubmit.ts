import { useRef } from "react";

export function useSoloSubmit(delay = 5000) {
  const lastSubmit = useRef(0);

  function preventRapidSubmit(e: React.FormEvent) {
    const now = Date.now();
    if (now - lastSubmit.current < delay) {
      e.preventDefault();
      console.log(`Form submission blocked for ${delay / 1000}s`);
    } else {
      lastSubmit.current = now;
    }
  }

  return { preventRapidSubmit };
}
