const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get('/', (req, res) => {
    const filePath = "questions.json";
    fs.promises.readFile(filePath, 'utf-8').then((data) => {
        const parsedData = JSON.parse(data);
        // console.log(parsedData);
        res.json(parsedData); // Use res.json() here
    }).catch((error) => {
        console.error("Error reading JSON file:", error);
        res.status(500).send("Internal Server Error");
    });
});

app.listen(3000|| process.env.PORT, () => {
    console.log("Server is running on port 3000");
});
