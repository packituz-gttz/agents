import { Type } from '@sinclair/typebox';
export const agentsRouter = async (fastify) => {
  fastify.post('/run', {
    schema: {
      body: Type.Object({
        // Define your request body schema here
        input: Type.String(),
      }),
      response: {
        200: Type.Object({
          // Define your response schema here
          result: Type.String(),
        }),
      },
    },
  }, async (request, reply) => {
    const { input } = request.body;
    // Here you would typically call your agent execution logic
    // For now, we'll just return a dummy response
    const result = `Agent processed: ${input}`;
    return { result };
  });
};
//# sourceMappingURL=agents.js.map