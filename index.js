/**
 * Myperplexity CLI - An AI-powered interactive CLI that answers questions using web search
 * 
 * This is the main entry point that:
 * 1. Initializes Tavily (search) and Genkit with Google AI (LLM) clients
 * 2. Creates a chat agent that combines search results with AI responses
 * 3. Runs an interactive readline loop to handle user queries
 */

import dotenv from 'dotenv';
import chalk from 'chalk';        // Terminal string styling
import ora from 'ora';            // Elegant terminal spinner
import { tavily } from '@tavily/core';          // Web search API
import { genkit } from 'genkit/beta';           // Genkit AI framework
import { googleAI } from '@genkit-ai/google-genai';  // Google AI plugin
import readline from 'readline';  // Node.js built-in for CLI input
import { createChatAgent } from './src/agent.js';

// Load environment variables from .env file
dotenv.config();



/**
 * Main function that launches the interactive CLI
 * Sets up the AI agent and handles the question-answer loop
 */
async function startInteractive() {
    try {
        // Validate required API keys
        const TavilyApiKey = process.env.TAVILY_API_KEY;
        if (!TavilyApiKey) {
            throw new Error('TAVILY_API_KEY is not set in the environment variables.');
        }
        const GeminiApiKey = process.env.GOOGLE_API_KEY;
        if (!GeminiApiKey) {
            throw new Error('GOOGLE_API_KEY is not set in the environment variables.');
        }

        // Initialize Tavily client for web search
        const client = tavily({ apiKey: TavilyApiKey });

        // Initialize Genkit with Google AI plugin
        const ai = genkit({ //ai as it appears in Genkit documentation
            plugins: [googleAI({ apiKey: GeminiApiKey })],
        });

        // Create chat agent that combines search + AI reasoning
        const chat = createChatAgent(ai, client, googleAI.model('gemini-2.5-flash-lite'));

        // Set up readline interface for interactive CLI input/output
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.green.bold('\n💬 Ask a question (or type "exit" to quit): '),
            terminal: true
        });

        console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════════╗'));
        console.log(chalk.cyan.bold('║   Welcome to Myperplexity CLI - Interactive Mode  ║'));
        console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════════╝'));
        console.log(chalk.gray('Type your questions an get AI-powdered answers with sources'));
        console.log(chalk.gray('Chat history is maintained during this session.'));
        console.log(chalk.gray('Commands: exit, quit, or press Ctrl+C to leave\n'));

        rl.prompt();

        // Event handler for each line of user input
        rl.on('line', async (line) => {
            const query = line.trim();

            // Skip empty input
            if (!query) {
                rl.prompt();
                return;
            }

            // Handle exit commands
            if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
                console.log(chalk.yellow('\n👋 Exiting Superplexity CLI. Goodbye!\n'));
                rl.close();
                return;
            }

            // Pause input while processing the query
            rl.pause();

            let spinner;
            try {
                spinner = ora('🧁 Thinking...').start();

                // Send query to chat agent (handles search + AI response)
                const { text } = await chat.send(query);

                spinner.succeed('✅ Answer Received!\n');

                // Display the AI-generated answer with sources
                console.log(chalk.blue.bold('Answer:'));
                console.log(chalk.white(text));

            } catch (error) {
                if (spinner) spinner.fail('❌ Error occurred while getting the answer.');
                console.error(chalk.red('Error:'), error.message);
            } finally {
                rl.resume(); // Resume accepting input
                rl.prompt();
            }
        });

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);

        // Provide helpful hints for common errors
        if (error.message.includes('TAVILY_API_KEY')) {
            console.log(chalk.yellow('\n💡 Tip: Make sure to set your TAVILY_API_KEY in the .env file'));
        }
        if (error.message.includes('GOOGLE_API_KEY')) {
            console.log(chalk.yellow('\n💡 Tip: Make sure to set your GOOGLE_API_KEY in the .env file '));
        }
        process.exit(1); // Exit with error code to prevent CLI from continuing after fatal failure
    }
}

startInteractive();