// fake AI answers until milestone 2, replace the body of getAssistantReply with a call
// to our /api/chat route. The widget calls it the same way, so the widget code won't need to change.
import type { AssistantReply, Message } from './types';

// // Pauses for `ms` milliseconds, pretending to be the time a real AI takes to answer.
// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // sample courses for the fake answers. Later, the real AI (or the course data we'll be adding) provides these
// const ics241: Course = { code: 'ICS 241', title: 'Discrete Math for CS II', credits: 3, prerequisite: 'ICS 141', pathway: 'Core' };
// const ics212: Course = { code: 'ICS 212', title: 'Program Structure', credits: 3, prerequisite: 'ICS 211', pathway: 'Core' };
// const ics314: Course = { code: 'ICS 314', title: 'Software Engineering I', credits: 3, prerequisite: '(ICS 211 or ECE 205) and [ICS 241 or ECE 362 or (MATH 301 and MATH 372)]', pathway: 'Core' };



// // Picks an answer by keyword. this is the part that gets deleted when the real AI is added
// const pickAnswer = (question: string): AssistantReply => {
//   const q = question.toLowerCase(); // so "ICS 311" and "ics 311" match the same way

//   if (q.includes('311')) {
//     return {
//       text: "Not yet. ICS 311 needs ICS 241, which isn't in your completed courses. You can take ICS 241, ICS 212, or ICS 314 now.",
//       courses: [ics241, ics212, ics314],
//       suggestions: ['What does ICS 241 cover?', 'Does ICS 355 count for my security focus?'],
//     }
//   };
  
//   if (q.includes('355') || q.includes('security')) {
//     return {
//       text: 'Yes, ICS 355 counts toward the Security & Information Assurance focus. It needs ICS 212 first, so plan on taking 212 before it.',
//       suggestions: ['What does ICS 241 cover?'],
//     }
//   }
//   if (q.includes('241')) {
//     return {
//       text: 'ICS 241 (Discrete Mathematics for CS II) covers proofs, recursion, graphs, and counting. It needs ICS 141.',
//       courses:[ics241],
//       suggestions: ['Can I take ICS 311?'],
//     }
//   }

//   return {
//     text: "I'm a mockup for now, so I only know a few sample questions. Try asking about ICS 311, ICS 241 or ICS 355!",
//     suggestions: ['Am I ready for ICS 311?', 'Does ICS 355 count for my security focus?'],
//   }
// };




// takes the whole conversation and returns the assistant's answer... eventually.
// this runs in the browser, so it can't call gemini directly (the api key would be exposed).
// instead it asks OUR server route (/api/chat), which holds the key and talks to gemini for us
export const getAssistantReply = async (history: Message[]): Promise<AssistantReply> => {
  // fetch sends an http request from the browser to a url; await waits until the server answers
  const response = await fetch('/api/chat', { // '/api/chat' = src/app/api/chat/route.ts on our own server
    method: 'POST', // POST = "here's data for you", which matches the POST function exported in route.ts
    headers: { 'Content-Type': 'application/json' }, // tells the server the body below is json
    body: JSON.stringify({ history }), // request bodies are plain text, so stringify turns our object into a json string
  });

  // response.ok is true for success codes (200-299) and false for errors like 500 from the route's catch
  if (!response.ok) {
    throw new Error(`Chat request failed (${response.status})`); // throwing hands it to ChatWidget's catch, which shows the error bubble
  }
  // .json() turns the server's json text back into an object: { text, courses?, suggestions? } aka an AssistantReply
  return response.json();
};