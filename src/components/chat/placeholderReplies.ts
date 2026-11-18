// fake AI answers until milestone 2, replace the body of getAssistantReply with a call
// to our /api/chat route. The widget calls it the same way, so the widget code won't need to change.
import type { Message } from './types';

// Pauses for `ms` milliseconds, pretending to be the time a real AI takes to answer.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Picks an answer by keyword. this is the part that gets deleted when the real AI is added
const pickAnswer = (question: string): string => {
  const q = question.toLowerCase(); // so "ICS 311" and "ics 311" match the same way

  if (q.includes('311')) {
    return "Not yet. ICS 311 needs ICS 241, which isn't in your completed courses. You can take ICS 241, ICS 212, or ICS 314 now.";
  }
  if (q.includes('355') || q.includes('security')) {
    return 'Yes, ICS 355 counts toward the Security & Information Assurance focus. It needs ICS 212 first, so plan on taking 212 before it.';
  }
  if (q.includes('241')) {
    return 'ICS 241 (Discrete Mathematics for CS II) covers proofs, recursion, graphs, and counting. It needs ICS 141.';
  }
  return "I'm a mockup for now, so I only know a few sample questions. Try asking about ICS 311, ICS 241 or ICS 355!";
};

// Takes the whole conversation (like a real AI would) and returns the assistant's answer... eventually.
export const getAssistantReply = async (history: Message[]): Promise<string> => {
  await wait(800);
  const latestQuestion = history[history.length - 1].text; // the message the user just sent
  return pickAnswer(latestQuestion);
};