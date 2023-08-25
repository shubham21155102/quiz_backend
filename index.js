import fs from "fs";
import express from "express"; 
import cors from "cors";
import env from "dotenv"; 
import {Configuration,OpenAIApi} from "openai"
env.config();
const app = express();
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    const filePath = "questions.json";
    fs.promises.readFile(filePath, 'utf-8').then((data) => {
        const parsedData = JSON.parse(data);
        res.json(parsedData); // Use res.json() here
    }).catch((error) => {
        console.error("Error reading JSON file:", error);
        res.status(500).send("Internal Server Error");
    });
});

app.get('/hack/:ques', async (req, res) => {
    try {
        const ques = req.params.ques;
        const config = new Configuration({
            apiKey: process.env.open_api
        });
        
        const openai = new OpenAIApi(config);
        
        const conversation = [
            { role: "user", content: ques },
            { role: "assistant", content: "This is the system message." }
        ];
        
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: conversation
        });
        
        const answer = chatCompletion.data.choices[0].message.content;
        
        res.json({ answer });
    } catch (error) {
        console.error("Error in /hack route:", error);
        res.status(500).send("Internal Server Error");
    }
});
const port = process.env.PORT || 3000; // Set the port correctly
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
