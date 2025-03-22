import { useState, useEffect, useCallback } from 'react';

export const useTimeElapsed = (createdAt: number) => {
  const [timeElapsed, setTimeElapsed] = useState('');

  const updateTimeElapsed = useCallback(() => {
    const now = Date.now();
    const diff = now - createdAt;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setTimeElapsed(`hace ${days} día${days !== 1 ? 's' : ''}`);
    } else if (hours > 0) {
      setTimeElapsed(`hace ${hours} hora${hours !== 1 ? 's' : ''}`);
    } else if (minutes > 0) {
      setTimeElapsed(`hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`);
    } else {
      setTimeElapsed('menos de 1 minuto');
    }
  }, [createdAt]);

  useEffect(() => {
    updateTimeElapsed();

    // Calcular el tiempo hasta el próximo minuto
    const now = Date.now();
    const nextMinute = Math.ceil(now / (1000 * 60)) * 1000 * 60;
    const timeUntilNextMinute = nextMinute - now;

    // Usar setTimeout para la primera actualización al próximo minuto
    const timeoutId = setTimeout(() => {
      updateTimeElapsed();
      // Después de la primera actualización, usar setInterval para actualizar cada minuto
      const intervalId = setInterval(updateTimeElapsed, 60000);
      return () => clearInterval(intervalId);
    }, timeUntilNextMinute);

    return () => clearTimeout(timeoutId);
  }, [updateTimeElapsed]);

  return timeElapsed;
}; 