import type * as t from './types';

export function formatResultsForLLM(
  turn: number,
  results: t.SearchResultData
): string {
  let output = '';

  const addSection = (title: string): void => {
    output += `\n=== ${title} ===\n`;
  };

  // Organic (web) results
  const organic = results.organic ?? [];
  if (organic.length) {
    addSection('Web Results, Turn ' + turn);
    organic.forEach((r, i) => {
      output += [
        `Source ${i}: ${r.title ?? '(no title)'}`,
        `Citation Anchor: \\ue202turn${turn}search${i}`,
        `URL: ${r.link}`,
        r.snippet != null ? `Summary: ${r.snippet}` : '',
        r.date != null ? `Date: ${r.date}` : '',
        r.attribution != null ? `Source: ${r.attribution}` : '',
        '',
        '--- Content Highlights ---',
        ...(r.highlights ?? [])
          .filter((h) => h.text.trim().length > 0)
          .map((h) => `[Relevance: ${h.score.toFixed(2)}]\n${h.text.trim()}`),
        '',
      ]
        .filter(Boolean)
        .join('\n');
    });
  }

  // Ignoring these sections for now
  // // Top stories (news)
  // const topStores = results.topStories ?? [];
  // if (topStores.length) {
  //   addSection('News Results');
  //   topStores.forEach((r, i) => {
  //     output += [
  //       `Anchor: \ue202turn0news${i}`,
  //       `Title: ${r.title ?? '(no title)'}`,
  //       `URL: ${r.link}`,
  //       r.snippet != null ? `Snippet: ${r.snippet}` : '',
  //       r.date != null ? `Date: ${r.date}` : '',
  //       r.attribution != null ? `Source: ${r.attribution}` : '',
  //       ''
  //     ].filter(Boolean).join('\n');
  //   });
  // }

  // // Images
  // const images = results.images ?? [];
  // if (images.length) {
  //   addSection('Image Results');
  //   images.forEach((img, i) => {
  //     output += [
  //       `Anchor: \ue202turn0image${i}`,
  //       `Title: ${img.title ?? '(no title)'}`,
  //       `Image URL: ${img.imageUrl}`,
  //       ''
  //     ].join('\n');
  //   });
  // }

  // Knowledge Graph
  if (results.knowledgeGraph != null) {
    addSection('Knowledge Graph');
    output += [
      `Title: ${results.knowledgeGraph.title ?? '(no title)'}`,
      results.knowledgeGraph.description != null
        ? `Description: ${results.knowledgeGraph.description}`
        : '',
      results.knowledgeGraph.type != null
        ? `Type: ${results.knowledgeGraph.type}`
        : '',
      results.knowledgeGraph.imageUrl != null
        ? `Image URL: ${results.knowledgeGraph.imageUrl}`
        : '',
      results.knowledgeGraph.attributes != null
        ? `Attributes: ${JSON.stringify(results.knowledgeGraph.attributes, null, 2)}`
        : '',
      '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  // Answer Box
  if (results.answerBox != null) {
    addSection('Answer Box');
    output += [
      results.answerBox.title != null
        ? `Title: ${results.answerBox.title}`
        : '',
      results.answerBox.answer != null
        ? `Answer: ${results.answerBox.answer}`
        : '',
      results.answerBox.snippet != null
        ? `Snippet: ${results.answerBox.snippet}`
        : '',
      results.answerBox.date != null ? `Date: ${results.answerBox.date}` : '',
      '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  // People also ask
  const peopleAlsoAsk = results.peopleAlsoAsk ?? [];
  if (peopleAlsoAsk.length) {
    addSection('People Also Ask');
    peopleAlsoAsk.forEach((p, _i) => {
      output += [`Q: ${p.question}`, `A: ${p.answer}`, '']
        .filter(Boolean)
        .join('\n');
    });
  }

  return output.trim();
}
