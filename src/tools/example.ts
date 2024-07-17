import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

export const chartTool = new DynamicStructuredTool({
  name: 'generate_bar_chart',
  description:
    'Generates a text-based bar chart from an array of data points and returns it as a string.',
  schema: z.object({
    data: z
      .object({
        label: z.string(),
        value: z.number(),
      })
      .array(),
  }),
  func: async ({ data }): Promise<string> => {
    const maxValue = Math.max(...data.map(d => d.value));
    const chartHeight = 20;
    const chartWidth = 50;

    let chart = '';

    // Generate Y-axis labels and bars
    for (let i = chartHeight; i >= 0; i--) {
      const row = data.map(d => {
        const barHeight = Math.round((d.value / maxValue) * chartHeight);
        return barHeight >= i ? '█' : ' ';
      });

      const yLabel = i === chartHeight ? maxValue.toString().padStart(4) :
        i === 0 ? '0'.padStart(4) :
          i % 5 === 0 ? Math.round((i / chartHeight) * maxValue).toString().padStart(4) : '    ';

      chart += `${yLabel} │${row.join(' ')} `;
    }

    // Generate X-axis
    chart += '     ├' + '─'.repeat(chartWidth) + ' ';

    // Generate X-axis labels
    const xLabels = data.map(d => d.label.padEnd(5).substring(0, 5)).join(' ');
    chart += `     ${xLabels} `;

    return chart;
  },
});

export const tavilyTool = new TavilySearchResults();
