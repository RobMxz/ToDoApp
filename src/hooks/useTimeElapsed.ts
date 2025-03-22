import { useState, useEffect, useCallback } from 'react';

export function useTimeElapsed(createdAt: number) {
  const [timeElapsed, setTimeElapsed] = useState<string>('');

  const updateTimeElapsed = useCallback(() => {
    const now = Date.now();
    const diff = now - createdAt;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeString = '';
    if (days > 0) {
      timeString = `hace ${days} día${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeString = `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      timeString = `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
      timeString = 'menos de 1 minuto';
    }

    setTimeElapsed(timeString);
  }, [createdAt]);

  useEffect(() => {
    updateTimeElapsed();
    
    // Calcular el tiempo hasta el próximo minuto
    const now = Date.now();
    const nextMinute = Math.ceil(now / (1000 * 60)) * 1000 * 60;
    const timeUntilNextMinute = nextMinute - now;

    // Establecer el intervalo para el próximo minuto
    const initialTimeout = setTimeout(() => {
      updateTimeElapsed();
      // Después del primer minuto, actualizar cada minuto
      const interval = setInterval(updateTimeElapsed, 60000);
      return () => clearInterval(interval);
    }, timeUntilNextMinute);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [updateTimeElapsed]);

  return timeElapsed;
} 