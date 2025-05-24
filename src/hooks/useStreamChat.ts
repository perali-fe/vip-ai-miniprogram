import { useCallback } from 'react';

interface StreamChatOptions {
  onUpdate: (content: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: string) => void;
}

interface StreamChatResponse {
  sendStreamMessage: (messages: any[]) => Promise<void>;
  abortStream: () => void;
}

export function useStreamChat({
  onUpdate,
  onComplete,
  onError,
}: StreamChatOptions): StreamChatResponse {
  let abortController: AbortController | null = null;

  const sendStreamMessage = useCallback(async (messages: any[]) => {
    // 创建新的 AbortController
    abortController = new AbortController();
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.error) {
                  onError(data.error);
                  return;
                }
                
                if (data.done) {
                  onComplete(fullContent);
                  return;
                }
                
                if (data.content) {
                  fullContent += data.content;
                  onUpdate(fullContent);
                }
              } catch (parseError) {
                console.error('解析SSE数据出错:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求已被取消');
      } else {
        console.error('流式请求出错:', error);
        onError(error.message || '请求失败');
      }
    }
  }, [onUpdate, onComplete, onError]);

  const abortStream = useCallback(() => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }, []);

  return {
    sendStreamMessage,
    abortStream,
  };
}