'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');

        try {
            // 调用 API 路由
            const response = await axios.post('/api/chat', { message: inputText });
            const botMessage: Message = {
                id: messages.length + 2,
                text: response.data.reply,
                sender: 'bot',
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                            } mb-2`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}