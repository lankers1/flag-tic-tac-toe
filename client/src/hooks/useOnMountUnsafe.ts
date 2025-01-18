import { EffectCallback, useEffect, useRef } from 'react';

export function useOnMountUnsafe(effect: EffectCallback, dependencies: any[]) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, dependencies);
}
