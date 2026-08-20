import { useEffect, useState } from "react";

/**
 * Estado sincronizado com localStorage (persistência local no navegador).
 * Este é um MVP client-side: TODO (produção real) substituir por uma
 * API/backend real com banco de dados multiusuário.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Armazenamento indisponível (modo privado, cota excedida, etc.) — falha silenciosa.
    }
  }, [key, state]);

  return [state, setState] as const;
}
