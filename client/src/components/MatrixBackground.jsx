import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw subtle animated lines instead of matrix text
    const animateBackground = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add very subtle green lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.lineWidth = 1;

      // Draw subtle grid lines
      for (let i = 0; i < canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      requestAnimationFrame(animateBackground);
    };

    animateBackground();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'multiply',
        opacity: 1
      }}
    />
  );
};

export default MatrixBackground;
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

