import { useState } from "react";

export function usePatternValidation(pattern: RegExp) {
  const [error, setError] = useState(false);

  function validate(value: string) {
    setError(!pattern.test(value));
  }

  return { error, validate };
}

export function useEmailValidation() {
  const [error, setError] = useState(false);

  function validate(value: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(value !== "" && !regex.test(value));
  }

  return { error, validate };
}

export function useUrlValidation() {
  const [error, setError] = useState(false);

  function validate(value: string) {
    try {
      new URL(value);
      setError(false);
    } catch {
      if (value !== "") setError(true);
    }
  }

  function normalize(value: string) {
    try {
      const url = new URL(value, window.location.origin);
      return url.toString();
    } catch {
      return value;
    }
  }

  return { error, validate, normalize };
}

export function usePasswordValidation() {
  const [error, setError] = useState(false);
  const [strong, setStrong] = useState(false);

  function validate(pw1: string, pw2: string) {
    if (pw1 && pw1 !== pw2) {
      setError(true);
    } else {
      setError(false);
    }
    setStrong(pw1.length >= 12 && /[A-Z]/.test(pw1) && /\d/.test(pw1));
  }

  return { error, strong, validate };
}
