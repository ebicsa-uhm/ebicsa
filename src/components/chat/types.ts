// message types for the chat widget

// one course shown as a visual card in the chat
export type Course = {
  code: string;         // e.g. 'ICS 241'
  title: string;        // e.g. 'Discrete Math for CS II'
  credits: number;
  prerequisite: string; // e.g. 'ICS 141'
  pathway: string;      // e.g. 'Core', 'Elective', etc
};

export type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  courses?: Course[]; // ? makes the field optional, aka Course[] | undefined
  suggestions?: string[];
};

// what the assistant sends back. Everything in a Message except id and role, which the widget adds itself.
export type AssistantReply = {
  text: string;
  courses?: Course[]; // ? makes the field optional, aka Course[] | undefined
  suggestions?: string[];
};
