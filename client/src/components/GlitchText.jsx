import { useState, useEffect } from 'react';

const GlitchText = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const glitchChars = '#$%&@!*^~+-=<>?[]{}|\\/';
  
  useEffect(() => {
    const words = text.split(' ');
    let currentWordIndex = 0;
    
    const glitchInterval = setInterval(() => {
      // Create a copy of words array
      const newWords = [...words];
      
      // Glitch the current word - replace all characters with random symbols
      const currentWord = words[currentWordIndex];
      const glitchedWord = currentWord
        .split('')
        .map(() => {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join('');
      
      // Replace the current word with glitched version
      newWords[currentWordIndex] = glitchedWord;
      setDisplayText(newWords.join(' '));
      
      // After a short delay, restore the word and move to next
      setTimeout(() => {
        setDisplayText(text);
        currentWordIndex = (currentWordIndex + 1) % words.length;
      }, 300);
    }, 2000); // Change word every 2 seconds
    
    return () => clearInterval(glitchInterval);
  }, [text]);
  
  // Split display text into words to check which one is glitched
  const displayWords = displayText.split(' ');
  const originalWords = text.split(' ');
  
  return (
    <span className={`inline-block ${className}`}>
      {displayWords.map((word, wordIdx) => {
        const isGlitched = word !== originalWords[wordIdx];
        return (
          <span key={wordIdx} className={wordIdx > 0 ? ' ml-1' : ''}>
            {word.split('').map((char, charIdx) => (
              <span
                key={charIdx}
                className={isGlitched ? 'text-cyber-red' : ''}
                style={isGlitched ? { 
                  textShadow: '0 0 10px rgba(220, 20, 60, 0.8)',
                } : {}}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
};

export default GlitchText;
