'use client';

import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Empty, Spin } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import MarkdownRenderer from './MarkdownRenderer';
import TypewriterText from './TypewriterText';
import { Message } from '@/types/chat';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessageId?: string;
}

export default function ChatInterface({ 
  messages, 
  isLoading, 
  streamingMessageId 
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className=\"flex-1 flex items-center justify-center p-8\">
        <Empty
          image={<RobotOutlined className=\"text-6xl text-gray-300\" />}
          description={
            <div className=\"text-center\">
              <p className=\"text-lg font-medium text-gray-600 mb-2\">
                欢迎使用 VIP AI 助手
              </p>
              <p className=\"text-gray-400\">
                我可以帮您解答问题、编写代码、翻译文本等
              </p>
              <p className=\"text-sm text-blue-500 mt-2\">
                ✨ 现在支持实时流式响应！
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className=\"flex-1 overflow-y-auto p-4 space-y-4\">
      {messages.map((message, index) => {
        const isStreaming = streamingMessageId === message.id;
        
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Avatar
              icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
              className={`flex-shrink-0 ${
                message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
              }`}
            />
            
            <Card
              className={`max-w-[80%] shadow-sm transition-all duration-200 ${
                message.role === 'user'
                  ? 'bg-blue-50 border-blue-200'
                  : isStreaming 
                    ? 'bg-green-50 border-green-200 shadow-green-100'
                    : 'bg-gray-50 border-gray-200'
              }`}
              bodyStyle={{ padding: '12px 16px' }}
            >
              <div className=\"text-sm text-gray-500 mb-1 flex items-center gap-2\">
                <span>
                  {message.role === 'user' ? '您' : 'AI助手'}
                </span>
                {isStreaming && (
                  <div className=\"flex items-center gap-1\">
                    <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\"></div>
                    <span className=\"text-green-600\">正在回复...</span>
                  </div>
                )}
                <span className=\"ml-auto\">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {message.role === 'assistant' ? (
                <div className=\"prose prose-sm max-w-none\">
                  {isStreaming ? (
                    <div className=\"min-h-[20px]\">
                      {message.content ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <div className=\"flex items-center gap-2 text-gray-500\">
                          <Spin size=\"small\" />
                          <span>思考中...</span>
                        </div>
                      )}
                      {message.content && (
                        <span className=\"inline-block w-2 h-5 bg-green-500 animate-pulse ml-1 align-bottom\"></span>
                      )}
                    </div>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}
                </div>
              ) : (
                <div className=\"whitespace-pre-wrap\">{message.content}</div>
              )}
            </Card>
          </motion.div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
}