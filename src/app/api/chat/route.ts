import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { message } = await request.json();

    try {
        console.log("dddd")
        // 调用 DeepSeek 模型的 API
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-ai/DeepSeek-R1', // 模型名称
                messages: [{ role: 'user', content: message }],
                stream: false, // 是否流式返回
                max_tokens: 512, // 最大 token 数
                temperature: 0.7, // 温度参数
                top_p: 0.7, // top_p 参数
                top_k: 50, // top_k 参数
                frequency_penalty: 0.5, // 频率惩罚
                n: 1, // 返回的候选数
                response_format: { type: 'text' }, // 返回格式
            }),
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // 返回 DeepSeek 的回复
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        return NextResponse.json(
            { error: 'Failed to get response from DeepSeek' },
            { status: 500 }
        );
    }
}