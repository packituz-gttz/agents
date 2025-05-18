import type * as t from './types';
import { getDomainName } from './utils';

function addHighlightSection(): string[] {
  return ['\n## Highlights\n\n', '', ''];
}

// Helper function to format a source (organic or top story)
function formatSource(
  source: t.ValidSource,
  index: number,
  turn: number,
  sourceType: 'search' | 'news',
  references: t.ResultReference[]
): string {
  let output = `\n# ${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} ${index}: "${source.title ?? '(no title)'}"`;

  /** Array of lines to include in the output */
  const outputLines = [
    `\nAnchor: \\ue202turn${turn}${sourceType}${index}`,
    `URL: ${source.link}`,
  ];

  if ('snippet' in source && source.snippet != null) {
    outputLines.push(`Summary: ${source.snippet}`);
  }

  if (source.date != null) {
    outputLines.push(`Date: ${source.date}`);
  }

  if (source.attribution != null) {
    outputLines.push(`Source: ${source.attribution}`);
  }

  if ((source.highlights?.length ?? 0) > 0) {
    outputLines.push(...addHighlightSection());
  } else {
    outputLines.push('');
  }

  output += outputLines.filter(Boolean).join('\n');

  // Process highlights if they exist
  (source.highlights ?? [])
    .filter((h) => h.text.trim().length > 0)
    .forEach((h, hIndex) => {
      output += `### Highlight ${hIndex + 1} [Relevance: ${h.score.toFixed(2)}]\n\n`;
      output += '```text\n' + h.text.trim() + '\n```\n\n';

      if (h.references != null && h.references.length) {
        let hasHeader = false;
        for (let j = 0; j < h.references.length; j++) {
          const ref = h.references[j];
          references.push({
            type: ref.type,
            link: ref.reference.originalUrl,
            attribution: getDomainName(ref.reference.originalUrl),
            title: (
              ((ref.reference.title ?? '') || ref.reference.text) ??
              ''
            ).split('\n')[0],
          });
          if (ref.type !== 'link') {
            continue;
          }
          if (!hasHeader) {
            output += 'Core References:';
            hasHeader = true;
          }
          output += `\n- ${ref.type}#${ref.originalIndex + 1}: ${ref.reference.originalUrl}\n\t- Anchor: \\ue202turn${turn}ref${references.length - 1}`;
        }
        if (hasHeader) {
          output += '\n';
        }
      }

      if (hIndex < (source.highlights?.length ?? 0) - 1) {
        output += '---\n\n';
      }
    });

  output += '\n';
  return output;
}

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
      output += formatSource(r, i, turn, 'search', references);
      delete results.organic[i].highlights;
    }
  }

  // Top stories (news)
  const topStories = results.topStories ?? [];
  if (topStories.length) {
    addSection('News Results');
    for (let i = 0; i < topStories.length; i++) {
      const r = topStories[i];
      output += formatSource(r, i, turn, 'news', references);
      if (results.topStories?.[i]?.highlights) {
        delete results.topStories[i].highlights;
      }
    }
  }

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
      results.knowledgeGraph.type != null
        ? `**Type:** ${results.knowledgeGraph.type}`
        : '',
      results.knowledgeGraph.description != null
        ? `**Description:** ${results.knowledgeGraph.description}`
        : '',
      results.knowledgeGraph.descriptionSource != null
        ? `**Description Source:** ${results.knowledgeGraph.descriptionSource}`
        : '',
      results.knowledgeGraph.descriptionLink != null
        ? `**Description Link:** ${results.knowledgeGraph.descriptionLink}`
        : '',
      results.knowledgeGraph.imageUrl != null
        ? `**Image URL:** ${results.knowledgeGraph.imageUrl}`
        : '',
      results.knowledgeGraph.website != null
        ? `**Website:** ${results.knowledgeGraph.website}`
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
      results.answerBox.snippet != null
        ? `**Snippet:** ${results.answerBox.snippet}`
        : '',
      results.answerBox.snippetHighlighted != null
        ? `**Snippet Highlighted:** ${results.answerBox.snippetHighlighted
          .map((s) => `\`${s}\``)
          .join(' ')}`
        : '',
      results.answerBox.link != null
        ? `**Link:** ${results.answerBox.link}`
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
        `"${p.question}"`,
        `${p.snippet != null && p.snippet ? `Snippet: ${p.snippet}}` : ''}`,
        `${p.title != null && p.title ? `Title: ${p.title}` : ''}`,
        `${p.link != null && p.link ? `Link: ${p.link}` : ''}`,
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
