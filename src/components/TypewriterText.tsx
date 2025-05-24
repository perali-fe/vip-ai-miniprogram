'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  className = '',
  onComplete 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // 当text改变时，重置状态
  useEffect(() => {
    if (text !== displayText && currentIndex >= displayText.length) {
      // 不重置，继续追加新内容
      const newContent = text.slice(displayText.length);
      if (newContent) {
        setCurrentIndex(displayText.length);
      }
    }
  }, [text, displayText, currentIndex]);

  // 如果文本完全改变，重置
  useEffect(() => {
    if (text.length < displayText.length || !text.startsWith(displayText.slice(0, Math.min(text.length, displayText.length)))) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [text, displayText]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}