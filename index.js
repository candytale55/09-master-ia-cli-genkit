import dotenv from 'dotenv';
import chalk from 'chalk';
import { tavily } from '@tavily/core';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Load environment variables
dotenv.config();



// This function launches the CLI

async function startInteractive() {
    try {
        const TavilyApiKey = process.env.TAVILY_API_KEY;
        if (!TavilyApiKey) {
            throw new Error('TAVILY_API_KEY is not set in the environment variables.');
        }
        const GeminiApiKey = process.env.GOOGLE_API_KEY;
        if (!GeminiApiKey) {
            throw new Error('GOOGLE_API_KEY is not set in the environment variables.');
        }

        // Create clients
        const client = tavily({ apiKey: TavilyApiKey }); //TODO: Rename client to clientTavily or similar if possible

        // "ai" because genkit docs use it 
        const ai = genkit({
            plugins: [googleAI({ apiKey: GeminiApiKey })],
        });


    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);

        if (error.message.includes('TAVILY_API_KEY')) {
            console.log(chalk.yellow('\n💡 Tip: Make sure to set your TAVILY_API_KEY in the .env file'));
        }
        if (error.message.includes('GOOGLE_API_KEY')) {
            console.log(chalk.yellow('\n💡 Tip: Make sure to set your GOOGLE_API_KEY in the .env file '));
        }
        process.exit(1);
        // Force the process to exit with an error code so the CLI
        // doesn’t continue running after a fatal startup failure.
    }
}

startInteractive();