const dotenv = require("dotenv");
dotenv.config({
    path:"./.env"
})
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const model = "gemini-1.5-pro";
const cleanResponse = (debugText)=>{
    debugText
    .replace(/(\*|```c\+\+|```)/g, "")
    .trim()
    .split("\n")
    .filter(line => line.trim() !== "");
}
exports.codeDebug = async(req , res)=>{
    try {
        const {sourceCode} = req.body;
        if(!sourceCode){
            res.status(400).json({
                status:"failed",
                message:"sourceCode is needed! "
            })
        }
        const inputData = {
            contents: [{ role: "user", parts: [{ text: `i need your help in debug this code:\n${sourceCode}` }] }]
        };
        const response = await axios.post(`
            https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`, 
            inputData);
        const debugCode = await response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if(!debugCode){
            res.status(500).json({
                status:"failed",
                message:"error in generating debug code! "
            })
        }
        // const debug = cleanResponse(debugCode);
        // let finalResponse;
        res.status(200).json({
            status:"success",
            message:"the generated code is! ",
            debugCode
        })
    } catch (error) {
        console.log("error from debug-code! " , error);
        res.status(500).json({
            status:"failed",
            message:error
        })
    }
}
exports.explainCode = async(req , res)=>{
    try {
        const {sourceCode} = req.body;
        if(!sourceCode){
            res.status(400).json({
                status:"failed",
                message:"sourceCode is needed! "
            })
        }
        const inputData = {
            contents: [{ role: "user", parts: [{ text: `i need your help in to understand this code in simple terms:\n${sourceCode}` }] }]
        };
        const response = await axios.post(`
            https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`, 
            inputData);
        const explainedCode = await response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if(!explainedCode){
            res.status(500).json({
                status:"failed",
                message:"error in generating debug code! "
            })
        }
        // const debug = cleanResponse(debugCode);
        // let finalResponse;
        res.status(200).json({
            status:"success",
            message:"the generated code is! ",
            explainedCode
        })
    } catch (error) {
        console.log("error from debug-code! " , error);
        res.status(500).json({
            status:"failed",
            message:error
        })
    }
}