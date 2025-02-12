'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { sendMessage } from '../sercices/chatService';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    isLoading?: boolean;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim() === '' || isLoading) return;

        setIsLoading(true);
        const userMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
            isLoading: true,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');

        try {
            const reply = await sendMessage(inputText);
            const botMessage: Message = {
                id: messages.length + 2,
                text: reply,
                sender: 'bot',
            };
            setMessages((prevMessages) => [
                ...prevMessages.filter((msg) => msg.id !== userMessage.id), // 移除旧的加载状态消息
                { ...userMessage, isLoading: false }, // 更新为完成状态
                botMessage,
            ]);

        } catch (error) {
            console.error('Error sending message:', error);
            // 如果出错，移除加载状态并显示错误消息
            setMessages((prevMessages) => [
                ...prevMessages.filter((msg) => msg.id !== userMessage.id),
                { ...userMessage, isLoading: false },
                {
                    id: messages.length + 2,
                    text: '服务器繁忙，请稍后再试。',
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                            } mb-2 message-bubble`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >

                            {message.text}
                            {message.isLoading && (
                                <FaSpinner className="animate-spin ml-2" /> // 加载动画
                            )}
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
                    disabled={isLoading}
                    className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
}