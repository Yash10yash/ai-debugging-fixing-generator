import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%+-/~{[|`]}';
    const matrixArray = matrix.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Vary the color intensity for depth effect
        const opacity = Math.random() * 0.3 + 0.15;
        const isBright = Math.random() > 0.97;
        const isGreen = Math.random() > 0.9; // Occasionally use green for variety
        
        if (isBright) {
          ctx.fillStyle = isGreen 
            ? `rgba(0, 255, 65, ${opacity + 0.2})`
            : `rgba(255, 23, 68, ${opacity + 0.3})`;
        } else {
          ctx.fillStyle = isGreen
            ? `rgba(0, 255, 65, ${opacity})`
            : `rgba(255, 23, 68, ${opacity})`;
        }
        
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.12
      }}
    />
  );
};

export default MatrixBackground;
  );
};

export default MatrixBackground;

