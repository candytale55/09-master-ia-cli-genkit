/**
 * Agent Module - Creates AI chat agent with web search capabilities
 * 
 * Exports:
 * - createSearchTool: Defines a Genkit tool that performs web searches
 * - createChatAgent: Creates a chat agent with search tool and prompt configuration
 */

import { z } from 'zod';          // Schema validation
import { searchWeb } from './search.js';

/**
 * Creates a Genkit tool for web search using Tavily
 * @param {Object} ai - Genkit instance
 * @param {Object} client - Tavily client
 * @returns {Object} Genkit tool definition
 */
export function createSearchTool(ai, client) {
    return ai.defineTool({
        name: 'searchWeb',
        description: 'Search the web for current information to answer user queries. Use this when you need up-to-date or factual information.',
        inputSchema: z.object({
            query: z.string().describe('The user query to search for.'),
        }),
        outputSchema: z.string().describe('The search results as a formatted string including titles, snippets, and URLs'),
    }, async (input) => {
        // Execute web search via Tavily
        const searchResults = await searchWeb(client, input.query, 5);

        // Format results as numbered list with title, URL, and content
        const formattedResults = searchResults.results
            .map((result, index) => {
                return `[${index + 1}] ${result.title}\nURL: ${result.url}\nContent: ${result.content}\n`;
            }).join('\n');

        return `Search results for "${input.query}":`;
    });
}

/**
 * Creates a chat agent with web search capabilities
 * @param {Object} ai - Genkit instance
 * @param {Object} client - Tavily client
 * @param {Object} model - Google AI model to use (e.g., gemini-2.5-flash-lite)
 * @returns {Object} Chat session with send() method
 */
export function createChatAgent(ai, client, model) {
    // Define the search tool for the agent
    const searchTool = createSearchTool(ai, client);

    // Define prompt with instructions for the AI and attach the search tool
    const searchPrompt = ai.definePrompt({
        name: 'searchPrompt',
        description: 'Prompt that searches the web to answer user queries based on current information.',
        model: model,
        input: {
            schema: z.object({
                query: z.string().describe('The user query to be answered using web search results.'),
            }),
        },
        tools: [searchTool],  // Attach searchWeb tool so AI can call it
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
