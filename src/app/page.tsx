'use client';

import { MessageOutlined, RobotOutlined, SendOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';

import ChatInterface from '@/components/ChatInterface';
import { useStreamChat } from '@/hooks/useStreamChat';
import { Message } from '@/types/chat';
import { generateId } from '@/utils/chat';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);

  // 流式响应处理
  const { sendStreamMessage, abortStream } = useStreamChat({
    onUpdate: (content: string) => {
      if (currentStreamingMessage) {
        setCurrentStreamingMessage(prev => prev ? {
          ...prev,
          content: content,
        } : null);
      }
    },
    onComplete: (fullContent: string) => {
      if (currentStreamingMessage) {
        const finalMessage: Message = {
          ...currentStreamingMessage,
          content: fullContent,
        };
        setMessages(prev => [...prev, finalMessage]);
        setCurrentStreamingMessage(null);
      }
      setIsLoading(false);
    },
    onError: (error: string) => {
      console.error('流式响应错误:', error);
      message.error(error || '发生了错误，请稍后再试。');
      
      if (currentStreamingMessage) {
        const errorMessage: Message = {
          ...currentStreamingMessage,
          content: '抱歉，发生了错误，请稍后再试。',
        };
        setMessages(prev => [...prev, errorMessage]);
        setCurrentStreamingMessage(null);
      }
      setIsLoading(false);
    },
  });

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    const aiMessage: Message = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
    };

    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // 设置当前流式消息
    setCurrentStreamingMessage(aiMessage);

    try {
      await sendStreamMessage([...messages, userMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请重试');
      setIsLoading(false);
      setCurrentStreamingMessage(null);
    }
  }, [inputValue, isLoading, messages, sendStreamMessage]);

  const handleStopGeneration = useCallback(() => {
    abortStream();
    setIsLoading(false);
    
    if (currentStreamingMessage && currentStreamingMessage.content) {
      // 保存已生成的内容
      setMessages(prev => [...prev, currentStreamingMessage]);
    }
    setCurrentStreamingMessage(null);
    message.info('已停止生成');
  }, [abortStream, currentStreamingMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 合并显示的消息（包括正在流式生成的消息）
  const displayMessages = currentStreamingMessage 
    ? [...messages, currentStreamingMessage]
    : messages;

  return (
    <Layout className=\"min-h-screen\">
      <Header className=\"bg-white shadow-sm border-b\">
        <div className=\"flex items-center justify-between h-full\">
          <div className=\"flex items-center gap-3\">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ 
                duration: 2, 
                repeat: isLoading ? Infinity : 0, 
                ease: \"linear\" 
              }}
            >
              <RobotOutlined className=\"text-2xl text-blue-500\" />
            </motion.div>
            <Title level={3} className=\"!mb-0 !text-gray-800\">
              VIP AI 助手
            </Title>
            {isLoading && (
              <span className=\"text-sm text-green-500 animate-pulse\">
                正在思考中...
              </span>
            )}
          </div>
          <MessageOutlined className=\"text-xl text-gray-600\" />
        </div>
      </Header>
      
      <Content className=\"flex-1 flex flex-col\">
        <div className=\"flex-1 flex flex-col max-w-4xl mx-auto w-full\">
          <ChatInterface 
            messages={displayMessages}
            isLoading={isLoading}
            streamingMessageId={currentStreamingMessage?.id}
          />
          
          <div className=\"p-4 bg-white border-t\">
            <div className=\"flex gap-2 items-end\">
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder=\"输入您的问题...\"
                autoSize={{ minRows: 1, maxRows: 4 }}
                className=\"flex-1\"
                disabled={isLoading}
              />
              
              {isLoading ? (
                <Button
                  danger
                  icon={<StopOutlined />}
                  onClick={handleStopGeneration}
                  size=\"large\"
                >
                  停止
                </Button>
              ) : (
                <Button
                  type=\"primary\"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size=\"large\"
                >
                  发送
                </Button>
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}