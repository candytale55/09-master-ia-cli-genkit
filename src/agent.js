import { z } from 'zod';

// ai is Genkit, client is Tavili

export function createSearchTool(ai, client) {
    return ai.defineTool({
        name: 'searchWeb',
        description: 'Search the web for current information to answer user queries. Use this when you need up-to-date or factual information.',
        inputSchema: z.object({
            query: z.string().describe('The user query to search for.'),
        }),
        outputSchema: z.string().describe('The search results as a formatted string including titles, snippets, and URLs'),
    }, async (input) => {
        // Perform the web search using GoogleAI Client

        // const searchResults = await searchWeb(client, input.query, 5);

        // Format searchResults

        return `Search results for "${input.query}":\n`
    });    
}


export function createChatAgent(ai, client, model) {
    // Define the Search Tool
    const searchTool = createSearchTool(ai, client);

    // Create the Chat Agent with the Tool

    const searchPrompt = ai.definePrompt({
        name: 'searchPrompt', 
        description: 'Prompt that searches the web to answer user queries based on current information.',
        model: model,
        input: {
            schema: z.object({
                query: z.string().describe('The user query to be answered using web search results.'),
            }),
        },
        tools: [searchTool], 
        prompt: `You are a helpful AI assistant that provides comprehensive and accurate answers based on search results.
        
        User Query: {{query}}
        
        Instructions:
            1. Provide a comprehensive answer to the user's query based on the search results above
            2. Synthesize information from multiple sources when relevant
            3. Be factual and cite specific sources using [1], [2], etc. notation
            4. If the search results don't contain enough information, acknowledge this
            5. Keep the answer clear and well-structured
            6. Use narkdown formatting for better readability.
            7. Please use the tool searchWeb always when you need to look up current information
            8. Add a section at the end titled "Sources" listing the URLs of the references used
        
        Answer:`
    });
    return ai.chat(searchPrompt);
}
