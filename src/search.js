/**
 * Search Module - Wrapper for Tavily web search API
 * 
 * Performs web searches with advanced depth and returns structured results
 */

/**
 * Searches the web using Tavily API
 * @param {Object} client - Tavily client instance
 * @param {string} query - Search query
 * @param {number} numResults - Number of results to return (default: 5)
 * @returns {Promise<Object>} Search response with results array
 */
export async function searchWeb(client, query, numResults = 5) {
    try {
        const response = await client.search(query, {
            searchDepth: 'advanced',      // More thorough search
            numResults: numResults,
            includeAnswer: true,          // Include Tavily's AI-generated answer
            includeRawContent: false,     // Don't include full page HTML
            includeImages: false,         // No image results
        });

        return response;

    } catch (error) {
        throw new Error(`Search failed: ${error.message}`);
    }
}