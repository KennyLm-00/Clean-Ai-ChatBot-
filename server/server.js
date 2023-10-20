import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

// Setup the tools we need for the project.
dotenv.config();  // Get any secret settings from a special file.

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();  // Start a new application using Express.
app.use(cors());  // Allow other websites to talk to this one.
app.use(express.json());  // Prepare the app to read JSON data.

let chatData = [];  // Set up a space to remember the chat history.

try {
    chatData = JSON.parse(fs.readFileSync('chats.json'));
    // If there's an old chat history file, read it.
} catch (error) {
    console.error(error);
    // If there was a problem reading the file, let us know.
}

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from KLM Ai'
    })
    // If someone visits the main page, send them a message.
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        // Get the user's message from what they sent us.

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        // Ask the AI for a response based on the user's message.

        const botResponse = response.data.choices[0].text;
        // Get the AI's reply from its response.

        chatData.push({ user: prompt, bot: botResponse });
        // Save the conversation to remember it later.

        fs.writeFileSync('chats.json', JSON.stringify(chatData, null, 2));
        // Update the chat history file with the new conversation.

        res.status(200).send({
            bot: botResponse
        });
        // Send the AI's response back to the user.
    } catch (error) {
        console.log(error);
        // If something goes wrong, tell us in the console.
        res.status(500).send({ error })
        // Send an error message to the user.
    }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
// Start the server and let us know where it's running.


