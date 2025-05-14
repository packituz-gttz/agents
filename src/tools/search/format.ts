import type * as t from './types';
import { getDomainName } from './utils';

export function formatResultsForLLM(
  turn: number,
  results: t.SearchResultData
): { output: string; references: t.ResultReference[] } {
  let output = '';

  const addSection = (title: string): void => {
    output += `\n=== ${title} ===\n`;
  };

  const references: t.ResultReference[] = [];
  // Organic (web) results
  if (results.organic?.length != null && results.organic.length > 0) {
    addSection(`Web Results, Turn ${turn}`);
    for (let i = 0; i < results.organic.length; i++) {
      const r = results.organic[i];
      output += [
        `# Source ${i}: "${r.title ?? '(no title)'}"`,
        `Anchor: \\ue202turn${turn}search${i}`,
        `URL: ${r.link}`,
        r.snippet != null ? `Summary: ${r.snippet}` : '',
        r.date != null ? `Date: ${r.date}` : '',
        r.attribution != null ? `Source: ${r.attribution}` : '',
        '',
        '\n## Highlights\n\n',
        '',
        '',
      ]
        .filter(Boolean)
        .join('\n');

      (r.highlights ?? [])
        .filter((h) => h.text.trim().length > 0)
        .forEach((h, hIndex) => {
          output += `### Highlight ${hIndex + 1} [Relevance: ${h.score.toFixed(2)}]\n\n`;
          output += '```text\n' + h.text.trim() + '\n```\n\n';

          if (h.references != null && h.references.length) {
            output += 'Core References:\n';
            output += h.references
              .map((ref) => {
                references.push({
                  link: ref.reference.originalUrl,
                  attribution: getDomainName(ref.reference.originalUrl),
                  title: (
                    ((ref.reference.title ?? '') || ref.reference.text) ??
                    ''
                  ).split('\n')[0],
                });
                return `- ${ref.type}#${ref.originalIndex + 1}: ${ref.reference.originalUrl}\n\tAnchor: \\ue202turn${turn}ref${references.length - 1}`;
              })
              .join('\n');
            output += '\n\n';
          }

          if (hIndex < (r.highlights?.length ?? 0) - 1) {
            output += '---\n\n';
          }
        });

      delete results.organic[i].highlights;
      output += '\n';
    }
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
      `**Title:** ${results.knowledgeGraph.title ?? '(no title)'}`,
      results.knowledgeGraph.description != null
        ? `**Description:** ${results.knowledgeGraph.description}`
        : '',
      results.knowledgeGraph.type != null
        ? `**Type:** ${results.knowledgeGraph.type}`
        : '',
      results.knowledgeGraph.imageUrl != null
        ? `**Image URL:** ${results.knowledgeGraph.imageUrl}`
        : '',
      results.knowledgeGraph.attributes != null
        ? `**Attributes:**\n\`\`\`json\n${JSON.stringify(
          results.knowledgeGraph.attributes,
          null,
          2
        )}\n\`\`\``
        : '',
      '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  // Answer Box
  if (results.answerBox != null) {
    addSection('Answer Box');
    output += [
      results.answerBox.title != null
        ? `**Title:** ${results.answerBox.title}`
        : '',
      results.answerBox.answer != null
        ? `**Answer:** ${results.answerBox.answer}`
        : '',
      results.answerBox.snippet != null
        ? `**Snippet:** ${results.answerBox.snippet}`
        : '',
      results.answerBox.date != null
        ? `**Date:** ${results.answerBox.date}`
        : '',
      '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  // People also ask
  const peopleAlsoAsk = results.peopleAlsoAsk ?? [];
  if (peopleAlsoAsk.length) {
    addSection('People Also Ask');
    peopleAlsoAsk.forEach((p, i) => {
      output += [
        `### Question ${i + 1}:`,
        `**Q:** ${p.question}`,
        `**A:** ${p.answer}`,
        '',
      ]
        .filter(Boolean)
        .join('\n\n');
    });
  }
  return {
    output: output.trim(),
    references,
  };
}
