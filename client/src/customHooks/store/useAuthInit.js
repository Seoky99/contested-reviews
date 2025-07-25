import { useEffect } from 'react';
import useAuthStore from './useAuthStore';

export default function useAuthInit() {

  const refresh = useAuthStore((state) => state.refresh);
  useEffect(() => {
    refresh();
  }, []);
}