import { Message } from '@/types/chat';

/**
 * 格式化时间戳
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}

/**
 * 清理消息内容
 */
export function sanitizeMessage(content: string): string {
  return content.trim().replace(/\s+/g, ' ');
}

/**
 * 检查是否为代码块
 */
export function isCodeBlock(content: string): boolean {
  return content.includes('```') || content.includes('`');
}

/**
 * 导出聊天记录
 */
export function exportChatHistory(messages: Message[]): string {
  const chatHistory = messages.map(msg => {
    const role = msg.role === 'user' ? '用户' : 'AI助手';
    const time = formatTimestamp(msg.timestamp);
    return `[${time}] ${role}: ${msg.content}`;
  }).join('\n\n');

  return chatHistory;
}

/**
 * 本地存储聊天记录
 */
export function saveChatToStorage(messages: Message[]): void {
  try {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
}

/**
 * 从本地存储加载聊天记录
 */
export function loadChatFromStorage(): Message[] {
  try {
    const stored = localStorage.getItem('chat_history');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
  return [];
}