'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReadMoreProps {
  text: string;
  wordLimit: number;
}

export function ReadMore({ text, wordLimit }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use a simple regex to split by words, this is basic and can be improved
  const words = text.split(' ');
  const isTruncated = words.length > wordLimit;

  const displayText = isExpanded ? text : words.slice(0, wordLimit).join(' ') + (isTruncated ? '...' : '');

  // Use dangerouslySetInnerHTML because product descriptions can contain HTML
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div>
      <motion.div
        animate={{ height: 'auto' }}
        className="prose prose-lg max-w-none mb-4"
        dangerouslySetInnerHTML={createMarkup(displayText)}
      />
      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-bold text-boinng-blue hover:underline"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}
