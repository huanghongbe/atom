import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // 这里可以调用你的聊天机器人 API 或者直接返回一个模拟的回复
        const reply = `You said: ${message}`;

        res.status(200).json({ reply });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}