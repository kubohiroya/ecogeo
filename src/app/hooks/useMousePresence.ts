import { useEffect, useState } from 'react';

const useMousePresence = () => {
  const [isMouseAvailable, setIsMouseAvailable] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);

  useEffect(() => {
    // マウスポインタが利用可能かどうかをチェック
    const checkMouseAvailability = () => {
      setIsMouseAvailable(window.matchMedia('(pointer: fine)').matches);
    };

    // マウスポインタがブラウザ画面内にあるかどうかを監視
    const updateMousePresence = (event: MouseEvent) => {
      setIsMouseInside(event.type === 'mousemove');
    };

    checkMouseAvailability();
    window.addEventListener('mousemove', updateMousePresence);
    window.addEventListener('mouseleave', updateMousePresence);

    return () => {
      window.removeEventListener('mousemove', updateMousePresence);
      window.removeEventListener('mouseleave', updateMousePresence);
    };
  }, []);

  return { isMouseAvailable, isMouseInside };
};

export default useMousePresence;
