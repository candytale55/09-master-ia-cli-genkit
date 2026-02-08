import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();
// test .env variables
console.log("TAVILY_API_KEY present?", Boolean(process.env.TAVILY_API_KEY));
console.log("GOOGLE_API_KEY present?", Boolean(process.env.GOOGLE_API_KEY));

// Test correct (Output):
/* 
[dotenv@17.2.4] injecting env (2) from .env -- tip: ⚙️  specify custom .env
 file path with { path: '/custom/path/.env' }
TAVILY_API_KEY present? true
GOOGLE_API_KEY present? true
 */


// This function launches the CLI

async function startInteractive() {
    try {
        const TavilyApiKey = process.env.TAVILY_API_KEY;
        if (!TavilyApiKey) {
            throw new Error(chalk.red('TAVILY_API_KEY is not set in the environment variables.'));
        }
        const GoogleApiKey = process.env.GOOGLE_API_KEY;
        if (!GoogleApiKey) {
            throw new Error(chalk.red('GOOGLE_API_KEY is not set in the environment variables.'));
        }
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