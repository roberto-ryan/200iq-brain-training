import { useState, useEffect } from 'react';
import { checkPremium } from '../services/purchases';

export default function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremium()
      .then(setIsPremium)
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    checkPremium().then(setIsPremium);
  };

  return { isPremium, loading, refresh };
}
