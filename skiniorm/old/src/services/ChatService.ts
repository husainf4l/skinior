import { AGENT_API_URL } from '@env';

interface ChatMessage {
  message: string;
  thread_id: string;
}

interface SSEEvent {
  content?: string;
  section?: string;
  type?: string;
  thread_id?: string;
  model?: string;
  status?: string;
}

export class ChatService {
  private baseUrl = AGENT_API_URL?.replace('/chat/stream', '') || 'http://192.168.1.68:8007/chat-agent';

  async sendMessage(message: string, threadId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          thread_id: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      
      // Parse the SSE format response
      return this.parseSSEResponse(responseText);
    } catch (error) {
      console.error('ChatService error:', error);
      throw new Error('Failed to send message. Please check your connection.');
    }
  }

  // New method for real streaming using XMLHttpRequest
  async sendMessageWithRealStreaming(
    message: string,
    threadId: string | null,
    onThought: (chunk: string) => void,
    onAction: (chunk: string) => void,
    onObservation: (chunk: string) => void,
    onFinalAnswer: (chunk: string) => void,
    onComplete: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', `${this.baseUrl}/chat/stream`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      let buffer = '';
      
      xhr.onprogress = () => {
        // Get the new data since the last update
        const newData = xhr.responseText.substring(buffer.length);
        buffer = xhr.responseText;
        
        if (__DEV__ && newData) {
          console.log('🔄 STREAMING CHUNK:', newData);
        }
        
        // Parse Server-Sent Events
        const lines = newData.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (__DEV__) {
                console.log('📦 PARSED DATA:', data);
              }
              
              // Handle different agentic content types
              if (data.content) {
                if (data.section === 'thought' || data.type === 'thought') {
                  // AI thinking/reasoning
                  onThought(data.content);
                  if (__DEV__) {
                    console.log('🧠 THOUGHT CHUNK:', data.content);
                  }
                } else if (data.section === 'action' || data.type === 'action') {
                  // AI actions/tool usage
                  onAction(data.content);
                  if (__DEV__) {
                    console.log('⚡ ACTION CHUNK:', data.content);
                  }
                } else if (data.section === 'observation' || data.type === 'observation') {
                  // AI observations/tool results
                  onObservation(data.content);
                  if (__DEV__) {
                    console.log('👁️ OBSERVATION CHUNK:', data.content);
                  }
                } else if (data.section === 'final_answer' || data.type === 'final_answer') {
                  // Final answer content
                  onFinalAnswer(data.content);
                  if (__DEV__) {
                    console.log('✅ FINAL ANSWER CHUNK:', data.content);
                  }
                } else if (data.type === 'content') {
                  // Regular content - treat as final answer
                  onFinalAnswer(data.content);
                  if (__DEV__) {
                    console.log('📝 CONTENT CHUNK:', data.content);
                  }
                }
              }
            } catch (e) {
              // Skip malformed JSON or non-JSON data lines
              if (line.includes('[DONE]')) {
                if (__DEV__) {
                  console.log('🏁 STREAMING COMPLETE');
                }
                onComplete();
              }
            }
          }
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          onComplete();
          resolve();
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };
      
      xhr.ontimeout = () => {
        reject(new Error('Request timed out'));
      };
      
      // Set timeout to 30 seconds
      xhr.timeout = 30000;
      
      // Send the request
      xhr.send(JSON.stringify({
        message,
        thread_id: threadId,
      }));
    });
  }

  private parseSSEResponse(sseText: string): string {
    const lines = sseText.split('\n');
    let finalAnswerContent = '';
    let thoughtContent = '';
    
    for (const line of lines) {
      if (line.startsWith('data: ') && !line.includes('[DONE]')) {
        try {
          const data: SSEEvent = JSON.parse(line.slice(6));
          
          if (data.content) {
            // Collect final answer content (what we want to show to user)
            if (data.section === 'final_answer' || data.type === 'final_answer') {
              finalAnswerContent += data.content;
            }
            // Also collect thought content as fallback
            else if (data.section === 'thought' || data.type === 'thought') {
              thoughtContent += data.content;
            }
            // If no section specified, assume it's part of the answer
            else if (!data.section && !data.type) {
              finalAnswerContent += data.content;
            }
          }
        } catch (e) {
          // Skip malformed JSON
          console.log('Skipping malformed JSON:', line);
        }
      }
    }
    
    // Return final answer if available, otherwise thought content, otherwise raw response
    if (finalAnswerContent.trim()) {
      // Clean up markdown formatting
      return finalAnswerContent.replace(/\*\*Final Answer:\*\*\s*/, '').trim();
    } else if (thoughtContent.trim()) {
      return thoughtContent.replace(/\*\*Thought:\*\*\s*/, '').trim();
    } else {
      // Fallback to original behavior
      return sseText;
    }
  }

  static generateThreadId(): string {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new ChatService();
