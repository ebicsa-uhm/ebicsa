// Server-side chat endpoint. The widget POSTs the conversation here; we ask Gemini and send back the reply
// This file runs ONLY on the server, so GEMINI_API_KEY is never sent to the browser
import { GoogleGenAI } from '@google/genai'
import type { AssistantReply, Message } from '@/components/chat/types'
import { MAX_USER_CHARS } from '@/components/chat/limits'


//process.env reads variables from .env. this only works on the server which is why the call is here and not in the widget
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MODEL = 'gemini-3.5-flash-lite'; //can replace the model we use here, stay with gemini-3.5-flash-lite for faster replies and cheapest usage for our API
// limits for what we accept from the browser and what we forward to Gemini
const MAX_ASSISTANT_CHARS = 4000;  // longest earlier AI reply we'll accept back from the widget
const MAX_INCOMING_MESSAGES = 100; // more than this isn't a real chat, so reject it
const MAX_HISTORY_MESSAGES = 20;   // how many recent messages Gemini actually sees

// small helper so every "bad input" answer looks the same
const badRequest = (reason: string) => Response.json({ error: reason }, { status: 400 });

// the only parts of a Message the server needs. Pick<Type, 'a' | 'b'> copies just those fields from Message
type IncomingMessage = Pick<Message, 'role' | 'text'>;

// a "type guard": returns true/false, and the `m is IncomingMessage` return type tells TypeScript
// "if this returned true, treat m as an IncomingMessage from now on"
const isValidMessage = (m: unknown): m is IncomingMessage => { //this return type allows TS to narrow the type for us. the same way that Array.isArray does below
  if (typeof m !== 'object' || m === null) return false;  // same object check as step 1
  if (!('role' in m) || !('text' in m)) return false;     // both keys must exist
  if (typeof m.text !== 'string') return false;           // text must be a string (not a number, array, etc.)

  if (m.role === 'user') {
    // user text can't be only spaces, and can't be over the cap
    return m.text.trim().length > 0 && m.text.length <= MAX_USER_CHARS;
  }
  if (m.role === 'assistant') {
    return m.text.length <= MAX_ASSISTANT_CHARS;
  }
  return false; // any other role ('system', 'admin', 123...) is rejected
};



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
    const history: unknown[] = body.history; // unknown[] = "an array, but we haven't checked what's inside yet"

    // .every(fxn) is true only if fxn returns true for EVERY item. Because isValidMessage is a type 'guard',
    // after this check TypeScript knows history is IncomingMessage[]
    if (!history.every(isValidMessage)) {
      return badRequest('Each message needs a role of user or assistant and text within the length limit');
    }

    // .at(-1) gets the last item. ?. means "if it's undefined, stop and give undefined instead of crashing"
    if (history.at(-1)?.role !== 'user') {
      return badRequest('The last message must be from the user');
    }



    // keep only the most recent messages. A negative number in slice counts from the END,
    // so slice(-20) = "the last 20" (or the whole array if there are fewer than 20)
    const recent = history.slice(-MAX_HISTORY_MESSAGES);

    // the cut might end up on an assistant message which will trigger lines above, so start at the first USER message in what's left
    // (this also still skips the "Aloha!" greeting). Above guarantees the last message is from the user,
    // so findIndex always finds one and can never return -1 anymore
    const firstUser = recent.findIndex((m) => m.role === 'user');

    const steps = recent.slice(firstUser).map((m) => m.role === 'user' ? { type: 'user_input' as const, content: [{ type: 'text' as const, text: m.text }] } 
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