import { useState } from 'react';
import {
    GoogleGenerativeAI,
} from "@google/generative-ai"

const apiKey = "AIzaSyB0TSy9ma9ArMS8MfWrn7OuEqmFU98y_Hk";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    async function run() {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        const chatSession = model.startChat({
            generationConfig,
            history: [
            ],
        });

        const result = await chatSession.sendMessage(input);
        console.log(result.response.text());
        const botMessage = { text: result.response.text(), sender: 'bot' };
        setMessages([...messages, userMessage, botMessage]);
        setInput('');
    }

    return (
        <div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && run()}
            />
            <button onClick={run}>Send</button>
        </div>
    );
};

export default Chat;
