// shared by the chat widget (browser) and /api/chat (server), so both always agree on the limit of characters a user can send
export const MAX_USER_CHARS = 1000; // longest question a student can send
export const MAX_HISTORY_MESSAGES = 20; // how many recent messages Gemini sees, so the widget only sends this many

