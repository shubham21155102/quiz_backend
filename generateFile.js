import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "codes");
const inputFiles = path.join(__dirname, "inputs");


if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}
if (!fs.existsSync(inputFiles)) {
    fs.mkdirSync(inputFiles, { recursive: true });
}

const languageFileExtension = {
    cpp: "cpp",
    python: "py",
    py: "py",
};

const generateFile = async (language, code, input) => {
    const jobID = uuid();

    const codeFileName = `${jobID}.${languageFileExtension[language]}`;
    const codeFilePath = path.join(dirCodes, codeFileName);
    await fs.promises.writeFile(codeFilePath, code);

    const inputFileName = `${jobID}.txt`;
    const inputFilePath = path.join(inputFiles, inputFileName);
    await fs.promises.writeFile(inputFilePath, input);

    return [codeFilePath, inputFilePath];
};

export default generateFile
