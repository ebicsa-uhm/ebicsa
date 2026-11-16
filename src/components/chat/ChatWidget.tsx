// This component will be the *widget* itself, as the circular logo, and popup card will all be found here
'use client';

import { Card } from "react-bootstrap";
import ChatMessage from "./ChatMessage";

const ChatWidget = () => (
  <Card className="position-fixed bottom-0 end-0 m-3 shadow" style={{width: '22rem', zIndex: 1050}}>
    <Card.Header className="bg-success text-white">
      <div className="fw-bold">Ask EBICSA</div>
      <small>your ICS advising assistant</small>
    </Card.Header>

    <Card.Body>
      <ChatMessage role="user" text="Do I need ICS 241 before ICS 311"/>
      <ChatMessage role="assistant" text="Yes. ICS 311 (Algorithms) lists ICS 241 as a prerequisite. You've finished ICS 141, so you can take ICS 241 next term."/>
    </Card.Body>
    
  </Card>
);

export default ChatWidget;
