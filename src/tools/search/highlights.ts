import type * as t from './types';

// 2. Pre-compile all regular expressions (only do this once)
// Group patterns by priority for early returns
const priorityPatterns = [
  // High priority patterns (structural)
  [
    { regex: /\n\n/g }, // Double newline (paragraph break)
    { regex: /\n/g }, // Single newline
    { regex: /={3,}\s*\n|-{3,}\s*\n/g }, // Section separators
  ],
  // Medium priority (semantic)
  [
    { regex: /[.!?][")\]]?\s/g }, // End of sentence
    { regex: /;\s/g }, // Semicolon
    { regex: /:\s/g }, // Colon
  ],
  // Low priority (any breaks)
  [
    { regex: /,\s/g }, // Comma
    { regex: /\s-\s/g }, // Dash surrounded by spaces
    { regex: /\s/g }, // Any space
  ],
];

function findFirstMatch(text: string, regex: RegExp): number {
  // Reset regex
  regex.lastIndex = 0;

  // For very long texts, try chunking
  if (text.length > 10000) {
    const chunkSize = 2000;
    let position = 0;

    while (position < text.length) {
      const chunk = text.substring(position, position + chunkSize);
      regex.lastIndex = 0;

      const match = regex.exec(chunk);
      if (match) {
        return position + match.index;
      }

      // Move to next chunk with some overlap
      position += chunkSize - 100;
      if (position >= text.length) break;
    }
    return -1;
  }

  // For shorter texts, normal regex search
  const match = regex.exec(text);
  return match ? match.index : -1;
}

// 3. Optimized boundary finding functions
function findLastMatch(text: string, regex: RegExp): number {
  // Reset regex state
  regex.lastIndex = 0;

  let lastIndex = -1;
  let lastLength = 0;
  let match;

  // For very long texts, use a different approach to avoid regex engine slowdowns
  if (text.length > 10000) {
    // Try dividing the text into chunks for faster processing
    const chunkSize = 2000;
    let startPosition = Math.max(0, text.length - chunkSize);

    while (startPosition >= 0) {
      const chunk = text.substring(startPosition, startPosition + chunkSize);
      regex.lastIndex = 0;

      let chunkLastIndex = -1;
      let chunkLastLength = 0;

      while ((match = regex.exec(chunk)) !== null) {
        chunkLastIndex = match.index;
        chunkLastLength = match[0].length;
      }

      if (chunkLastIndex !== -1) {
        return startPosition + chunkLastIndex + chunkLastLength;
      }

      // Move to previous chunk with some overlap
      startPosition = Math.max(0, startPosition - chunkSize + 100) - 1;
      if (startPosition <= 0) break;
    }
    return -1;
  }

  // For shorter texts, normal regex search
  while ((match = regex.exec(text)) !== null) {
    lastIndex = match.index;
    lastLength = match[0].length;
  }

  return lastIndex === -1 ? -1 : lastIndex + lastLength;
}

// 4. Find the best boundary with priority groups
function findBestBoundary(text: string, direction = 'backward'): number {
  if (!text || text.length === 0) return 0;

  // Try each priority group
  for (const patternGroup of priorityPatterns) {
    for (const pattern of patternGroup) {
      const position =
        direction === 'backward'
          ? findLastMatch(text, pattern.regex)
          : findFirstMatch(text, pattern.regex);

      if (position !== -1) {
        return position;
      }
    }
  }

  // No match found, use character boundary
  return direction === 'backward' ? text.length : 0;
}

/**
 * Expand highlights in search results using smart boundary detection.
 *
 * This implementation finds natural text boundaries like paragraphs, sentences,
 * and phrases to provide context while maintaining readability.
 *
 * @param searchResults - Search results object
 * @param mainExpandBy - Primary expansion size on each side (default: 300)
 * @param separatorExpandBy - Additional range to look for separators (default: 150)
 * @returns Copy of search results with expanded highlights
 */
export function expandHighlights(
  searchResults: t.SearchResultData,
  mainExpandBy = 300,
  separatorExpandBy = 150
): t.SearchResultData {
  // 1. Avoid full deep copy - only copy what we modify
  const resultCopy = { ...searchResults };

  // Only deep copy the relevant arrays
  if (resultCopy.organic) {
    resultCopy.organic = [...resultCopy.organic];
  }
  if (resultCopy.topStories) {
    resultCopy.topStories = [...resultCopy.topStories];
  }

  // 5. Process the results efficiently
  const processResultTypes = ['organic', 'topStories'] as const;

  for (const resultType of processResultTypes) {
    if (!resultCopy[resultType as 'organic' | 'topStories']) continue;

    // Map results to new array with modified highlights
    resultCopy[resultType] = resultCopy[resultType]?.map((result) => {
      if (
        result.content == null ||
        result.content === '' ||
        !result.highlights ||
        result.highlights.length === 0
      ) {
        return result; // No modification needed
      }

      // Create a shallow copy with expanded highlights
      const resultCopy = { ...result };
      const content = result.content;
      const highlights = [];

      // Process each highlight
      for (const highlight of result.highlights) {
        const highlightText = highlight.text;

        let startPos = content.indexOf(highlightText);
        let highlightLen = highlightText.length;

        if (startPos === -1) {
          // Try with stripped whitespace
          const strippedHighlight = highlightText.trim();
          startPos = content.indexOf(strippedHighlight);

          if (startPos === -1) {
            highlights.push({
              text: highlight.text,
              score: highlight.score,
            });
            continue;
          }
          highlightLen = strippedHighlight.length;
        }

        // Calculate boundaries
        const mainStart = Math.max(0, startPos - mainExpandBy);
        const mainEnd = Math.min(
          content.length,
          startPos + highlightLen + mainExpandBy
        );

        const separatorStart = Math.max(0, mainStart - separatorExpandBy);
        const separatorEnd = Math.min(
          content.length,
          mainEnd + separatorExpandBy
        );

        // Extract text segments
        const headText = content.substring(separatorStart, mainStart);
        const tailText = content.substring(mainEnd, separatorEnd);

        // Find natural boundaries
        const bestHeadBoundary = findBestBoundary(headText, 'backward');
        const bestTailBoundary = findBestBoundary(tailText, 'forward');

        // Calculate final positions
        const finalStart = separatorStart + bestHeadBoundary;
        const finalEnd = mainEnd + bestTailBoundary;

        // Extract the expanded highlight
        const expandedHighlightText = content
          .substring(finalStart, finalEnd)
          .trim();
        highlights.push({
          text: expandedHighlightText,
          score: highlight.score,
        });
      }

      delete resultCopy.content;
      resultCopy.highlights = highlights;
      return resultCopy;
    });
  }

  return resultCopy;
}
