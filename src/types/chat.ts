export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface ApiResponse {
  content: string;
  error?: string;
}

export interface StreamResponse {
  delta: string;
  done: boolean;
}