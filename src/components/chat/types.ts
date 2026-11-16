// message types for the chat widget

export type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

