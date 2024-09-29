import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
  } from "@google/generative-ai";

const VITE_GOOGLE_GEMINI_API_KEY = "AIzaSyCuxnlMojKY5I5rWEc2X9ibV6E8yjymMDA"

const safetySetting = [
{
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
},
{
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
},
];

const genAI = new GoogleGenerativeAI(VITE_GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash",
safetySetting,
});

export default model;