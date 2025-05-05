/* eslint-disable no-console */
import axios from 'axios';
import type * as t from './types';

export abstract class BaseReranker {
  protected apiKey: string | undefined;

  constructor() {
    // Each specific reranker will set its API key
  }

  abstract rerank(
    query: string,
    documents: string[],
    topK?: number
  ): Promise<t.Highlight[]>;

  protected getDefaultRanking(
    documents: string[],
    topK: number
  ): t.Highlight[] {
    return documents
      .slice(0, Math.min(topK, documents.length))
      .map((doc) => ({ text: doc, score: 0 }));
  }

  protected logDocumentSamples(documents: string[]): void {
    console.log('Sample documents being sent to API:');
    for (let i = 0; i < Math.min(3, documents.length); i++) {
      console.log(`Document ${i}: ${documents[i].substring(0, 100)}...`);
    }
  }
}

export class JinaReranker extends BaseReranker {
  constructor({ apiKey = process.env.JINA_API_KEY }: { apiKey?: string }) {
    super();
    this.apiKey = apiKey;
  }

  async rerank(
    query: string,
    documents: string[],
    topK: number = 5
  ): Promise<t.Highlight[]> {
    console.log(`Reranking ${documents.length} documents with Jina`);

    try {
      if (this.apiKey == null || this.apiKey === '') {
        console.warn('JINA_API_KEY is not set. Using default ranking.');
        return this.getDefaultRanking(documents, topK);
      }

      this.logDocumentSamples(documents);

      const requestData = {
        model: 'jina-reranker-v2-base-multilingual',
        query: query,
        top_n: topK,
        documents: documents,
        return_documents: true,
      };

      const response = await axios.post<t.JinaRerankerResponse | undefined>(
        'https://api.jina.ai/v1/rerank',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      // Log the response data structure
      console.log('Jina API response structure:');
      console.log('Model:', response.data?.model);
      console.log('Usage:', response.data?.usage);
      console.log('Results count:', response.data?.results.length);

      // Log a sample of the results
      if ((response.data?.results.length ?? 0) > 0) {
        console.log(
          'Sample result:',
          JSON.stringify(response.data?.results[0], null, 2)
        );
      }

      if (response.data && response.data.results.length) {
        return response.data.results.map((result) => {
          const docIndex = result.index;
          const score = result.relevance_score;
          let text = '';

          // If return_documents is true, the document field will be present
          if (result.document != null) {
            const doc = result.document;
            if (typeof doc === 'object' && 'text' in doc) {
              text = doc.text;
            } else if (typeof doc === 'string') {
              text = doc;
            }
          } else {
            // Otherwise, use the index to get the document
            text = documents[docIndex];
          }

          return { text, score };
        });
      } else {
        console.warn(
          'Unexpected response format from Jina API. Using default ranking.'
        );
        return this.getDefaultRanking(documents, topK);
      }
    } catch (error) {
      console.error('Error using Jina reranker:', error);
      // Fallback to default ranking on error
      return this.getDefaultRanking(documents, topK);
    }
  }
}

export class CohereReranker extends BaseReranker {
  constructor({ apiKey = process.env.COHERE_API_KEY }: { apiKey?: string }) {
    super();
    this.apiKey = apiKey;
  }

  async rerank(
    query: string,
    documents: string[],
    topK: number = 5
  ): Promise<t.Highlight[]> {
    console.log(`Reranking ${documents.length} documents with Cohere`);

    try {
      if (this.apiKey == null || this.apiKey === '') {
        console.warn('COHERE_API_KEY is not set. Using default ranking.');
        return this.getDefaultRanking(documents, topK);
      }

      this.logDocumentSamples(documents);

      const requestData = {
        model: 'rerank-v3.5',
        query: query,
        top_n: topK,
        documents: documents,
      };

      const response = await axios.post<t.CohereRerankerResponse | undefined>(
        'https://api.cohere.com/v2/rerank',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      // Log the response data structure
      console.log('Cohere API response structure:');
      console.log('ID:', response.data?.id);
      console.log('Meta:', response.data?.meta);
      console.log('Results count:', response.data?.results.length);

      // Log a sample of the results
      if ((response.data?.results.length ?? 0) > 0) {
        console.log(
          'Sample result:',
          JSON.stringify(response.data?.results[0], null, 2)
        );
      }

      if (response.data && response.data.results.length) {
        return response.data.results.map((result) => {
          const docIndex = result.index;
          const score = result.relevance_score;
          const text = documents[docIndex];
          return { text, score };
        });
      } else {
        console.warn(
          'Unexpected response format from Cohere API. Using default ranking.'
        );
        return this.getDefaultRanking(documents, topK);
      }
    } catch (error) {
      console.error('Error using Cohere reranker:', error);
      // Fallback to default ranking on error
      return this.getDefaultRanking(documents, topK);
    }
  }
}

export class InfinityReranker extends BaseReranker {
  constructor() {
    super();
    // No API key needed for the placeholder implementation
  }

  async rerank(
    query: string,
    documents: string[],
    topK: number = 5
  ): Promise<t.Highlight[]> {
    console.log(
      `Reranking ${documents.length} documents with Infinity (placeholder)`
    );
    // This would be replaced with actual Infinity reranker implementation
    return this.getDefaultRanking(documents, topK);
  }
}

/**
 * Creates the appropriate reranker based on type and configuration
 */
export const createReranker = (config: {
  rerankerType: t.RerankerType;
  jinaApiKey?: string;
  cohereApiKey?: string;
}): BaseReranker | undefined => {
  const { rerankerType, jinaApiKey, cohereApiKey } = config;

  switch (rerankerType.toLowerCase()) {
  case 'jina':
    return new JinaReranker({ apiKey: jinaApiKey });
  case 'cohere':
    return new CohereReranker({ apiKey: cohereApiKey });
  case 'infinity':
    return new InfinityReranker();
  case 'none':
    console.log('Skipping reranking as reranker is set to "none"');
    return undefined;
  default:
    console.warn(
      `Unknown reranker type: ${rerankerType}. Defaulting to InfinityReranker.`
    );
    return new JinaReranker({ apiKey: jinaApiKey });
  }
};

// Example usage:
// const jinaReranker = new JinaReranker();
// const cohereReranker = new CohereReranker();
// const infinityReranker = new InfinityReranker();
