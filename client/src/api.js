import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constant";
// import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language , sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};

const deBugUrl = "http://localhost:3000/api/v1/code/debug";
export const deBugCode = async(sourceCode)=>{
  if(!sourceCode){
    return;
  }
  try {
    const response = await axios({
      method:"post",
      url:deBugUrl,
      data:{sourceCode},
      headers:{
        "Content-Type": "application/json"
      }
    })
    console.log("response from debugUrl " , response?.data);
    return response?.data;
  } catch (error) {
    console.log("error from debugurl " , error);
    throw error;
  }
}
const explainUrl = "http://localhost:3000/api/v1/code/explain";
export const explainCode = async(sourceCode)=>{
  if(!sourceCode){
    return;
  }
  try {
    const response = await axios({
      method:"post",
      url:explainUrl,
      data:{sourceCode},
      headers:{
        "Content-Type": "application/json"
      }
    })
    console.log("response from debugUrl " , response?.data);
    return response?.data;
  } catch (error) {
    console.log("error from debugurl " , error);
    throw error;
  }
}