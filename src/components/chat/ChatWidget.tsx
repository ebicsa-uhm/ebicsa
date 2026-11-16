// This component will be the *widget* itself, as the circular logo, and popup card will all be found here
'use client';

import { Card } from "react-bootstrap";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types"; //import type means this is only used for type checking; not importing something like a component or function

const sampleMessages: Message[] = [
  { id: 1, role: 'user', text: 'Do I need ICS 241 before ICS 311?'},
  { id: 2, role: 'assistant', text:"Yes. ICS 311 (Algorithms) lists ICS 241 as a prerequisite. You've finished ICS 141, so you can take ICS 241 next term."},
  { id: 3, role: 'user', text: 'Thanks!' }, 
] //hmmm this is just an array version that simplifies the process of mapping messages


const ChatWidget = () => (
  <Card className="position-fixed bottom-0 end-0 m-3 shadow" style={{width: '22rem', zIndex: 1050}}>
    <Card.Header className="bg-success text-white">
      <div className="fw-bold">Ask EBICSA</div>
      <small>your ICS advising assistant</small>
    </Card.Header>

    <Card.Body>
      {sampleMessages.map((message) => 
      (<ChatMessage key={message.id} role={message.role} text={message.text} />))}
    </Card.Body>
    
  </Card>
);

export default ChatWidget;
