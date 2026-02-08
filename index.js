import dotenv from 'dotenv';
import chalk from 'chalk';
import { tavily } from '@tavily/core';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import readline from 'readline';

// readLine is a core module from node that allows you to read from CLI without having to add an external library. 

    
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

        // Create interface
        const rl = readline.createInterface({
            input: process.stdin, 
            output: process.stdout,
            prompt: chalk.green.bold('\n💬 Ask a question (or type "exit" to quit): '),
            terminal: true
        });
        // readline creates a controlled conversation loop between stdin(what the user types) and stdout(what the program prints).

        console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════╗'));
        console.log(chalk.cyan.bold('║   Welcome to Superplexity CLI - Interactive Mode  ║'));
        console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════╝'));
        console.log(chalk.gray('Type your questions an get AI-powdered answers with sources'));
        console.log(chalk.gray('Chat history is maintained during this session.'));
        console.log(chalk.gray('Commands: exit, quit, or press Ctrl+C to leave\n'));
        
        rl.prompt();

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