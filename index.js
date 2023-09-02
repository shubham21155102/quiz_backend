import fs from "fs";
import express from "express"; 
import cors from "cors";
import env from "dotenv"; 
import {Configuration,OpenAIApi} from "openai"
import {exec} from "child_process"
import bodyParser from "body-parser"
env.config();
const app = express();
app.use(express.json());

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
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
       const answer1=answer.replace(/\\n/g, '\n')
       res.send(answer1) 
        // res.json({ answer1 });
    } catch (error) {
        console.error("Error in /hack route:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.post('/location', (req, res) => {
    console.log(req.body)
 const data=   {
        "latitude": 25.265824909699628,
        "longitude": 82.98601727128965
    }
    // const latitude = req.body.latitude;
    // const longitude = req.body.longitude;
    const latitude=data.latitude;
    const longitude=data.longitude
    console.log(latitude, longitude);
    // console.log(latitude,longitude)
    const executePython = (filepath) => {
        return new Promise((resolve, reject) => {
            exec(
                `python3 ${filepath} ${latitude} ${longitude}`,
                (error, stdout, stderr) => {
                    if (error) reject({ error, stderr });
                    if (stderr) reject({ stderr });
                    resolve(stdout);
                }
            );
        });
    };

    const filepath = 'location.py';
  
    executePython(filepath, latitude, longitude)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error executing Python script');
        });
});
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
