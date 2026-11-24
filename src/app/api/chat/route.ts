// Server-side chat endpoint. The widget POSTs the conversation here; we ask Gemini and send back the reply
// This file runs ONLY on the server, so GEMINI_API_KEY is never sent to the browser
import { GoogleGenAI } from '@google/genai'
import type { AssistantReply, Message } from '@/components/chat/types'

//process.env reads variables from .env. this only works on the server which is why the call is here and not in the widget
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MODEL = 'gemini-3.5-flash-lite'; //can replace the model we use here, stay with gemini-3.5-flash-lite for faster replies and cheapest usage for our API
// limits for what we accept from the browser and what we forward to Gemini
const MAX_USER_CHARS = 1000;       // longest question a student can send
const MAX_ASSISTANT_CHARS = 4000;  // longest earlier AI reply we'll accept back from the widget
const MAX_INCOMING_MESSAGES = 100; // more than this isn't a real chat, so reject it
const MAX_HISTORY_MESSAGES = 20;   // how many recent messages Gemini actually sees

// small helper so every "bad input" answer looks the same
const badRequest = (reason: string) => Response.json({ error: reason }, { status: 400 });



const SYS_INSTRUCTIONS = 'You are EBICSA, a friendly academic advising assistant for Information and Computer Sciences (ICS) ' +
  'students at the University of Hawaiʻi at Mānoa. Keep answers short and clear. ' +
  'If you are not sure about a requirement, say so and suggest confirming with an ICS advisor.';

//next.js calls this function for POST requests to /api/chat
export async function POST(request: Request) {
  try {
        // .catch(() => null): if the body isn't valid JSON, use null instead of crashing into the 500 catch below
    const body: unknown = await request.json().catch(() => null);

    // check the shape before touching it: must be an object that has a "history" array
    if (typeof body !== 'object' || body === null || !('history' in body) || !Array.isArray(body.history)) {
      return badRequest('Request must include a history array');
    }
    if (body.history.length === 0 || body.history.length > MAX_INCOMING_MESSAGES) {
      return badRequest('history has too few or too many messages');
    }
    const history = body.history;


    // Start at the first USER message (skips our "Aloha!" greeting), then convert each message
    // into a Gemini "step": user messages are user_input, assistant messages are model_output
    const firstUser = history.findIndex((m) => m.role === 'user');
    const steps = history.slice(firstUser).map((m) => m.role === 'user' ? { type: 'user_input' as const, content: [{ type: 'text' as const, text: m.text }] } 
      : { type: 'model_output' as const, content: [{ type: 'text' as const, text: m.text }] },
    );
    const interaction = await ai.interactions.create({ // the REAL API call
      model: MODEL,
      system_instruction: SYS_INSTRUCTIONS, // assistant's personality and rules sent with every request
      input: steps, // the whole conversation, so follow ups related to chat history make sense
      store: false, // we send the whole conversation each time, so Google doesn't need to store it
  });

      const text = interaction.output_text;
    if (!text) {
      const fallback: AssistantReply = { text: "Sorry, I couldn't quite come up with an answer. Please try rephrasing your question." };
      return Response.json(fallback);
    }

    // normal case: send the reply back to the widget as json
    const reply: AssistantReply = { text };
    return Response.json(reply);
  } catch (error) {
    // anything that failed above (bad key, rate limit, network) goes here
    console.error('Chat route error:', error); // shows in the terminal running npm run dev
    return Response.json({ error: 'Chat failed' }, { status: 500 }); // 500 makes response.ok false, so the widget shows its error bubble
  }
}