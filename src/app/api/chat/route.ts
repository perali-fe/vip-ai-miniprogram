import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

import { Message } from '@/types/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 转换消息格式为OpenAI格式
    const openaiMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    // 添加系统提示
    const systemMessage = {
      role: 'system' as const,
      content: `你是一个友善、专业的AI助手。你能够：
1. 回答各种问题
2. 编写和解释代码
3. 协助创作和翻译
4. 进行数学计算
5. 提供学习建议

请用中文回答，保持友善和专业的语气。对于代码相关的问题，请提供清晰的解释和示例。`,
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...openaiMessages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '抱歉，我没有理解您的问题。';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后再试。' },
      { status: 500 }
    );
  }
}