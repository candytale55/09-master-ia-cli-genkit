import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();




// This function launches the CLI

async function startInteractive() {
    try {
        nonexistentFunction(); // test chalk
        
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