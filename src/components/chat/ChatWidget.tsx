// This component will be the *widget* itself, we will implement the real circular launcher, mini popup, then expanded view
'use client';

import { Button, Card } from "react-bootstrap";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types"; //import type means this is only used for type checking; not importing something like a component or function
import { useState } from "react"; // useState gives the component a "memory" that survives re-renders; changing it redraws the component
import { ArrowsAngleContract, ArrowsAngleExpand, ChatDotsFill, DashLg, XLg } from "react-bootstrap-icons"; 

type ChatView = 'closed' | 'mini' | 'expanded'; // the only 3 views the widget can be in

const sampleMessages: Message[] = [
  { id: 1, role: 'user', text: 'Do I need ICS 241 before ICS 311?'},
  { id: 2, role: 'assistant', text:"Yes. ICS 311 (Algorithms) lists ICS 241 as a prerequisite. You've finished ICS 141, so you can take ICS 241 next term."},
  { id: 3, role: 'user', text: 'Thanks!' },
]; //hmmm this is just an array version that simplifies the process of mapping messages


// block body => { } instead of => ( ) because we need to run code (useState, messageList) before returning
const ChatWidget = () => {
  // view = the current value, setView = the function that changes it. starts as 'closed'
  // dont write view = 'mini' directly; React dont like that
  const [view, setView] = useState<ChatView>('closed');

  // JSX can be stored in a variable; built once here so both the mini popup and expanded panel can show {messageList}
  const messageList = sampleMessages.map((message) => (
    <ChatMessage key={message.id} role={message.role} text={message.text}/>
  ));



  // The <> </> (a Fragment) groups the popup, panel, and launcher together, because a component
  // can only return one thing. Unlike a <div>, it adds nothing extra to the page's HTML/CSS styles
  return (
    <>
      {/*--- Mini Popup HERE ---*/}
      {view === 'mini' && ( // && means: only render the Card if view is 'mini'; otherwise render nothing
        // position-fixed = stays in place while scrolling, shadow = drop shadow
        // right/bottom are inline styles (not Bootstrap's bottom-0 end-0) so the card sits ABOVE the round launcher
        // zIndex 1050 keeps it on top of the page content
        <Card className="position-fixed shadow" style={{ width: '22rem', right: '1rem', bottom: '5.5rem', zIndex: 1050 }}>
          {/* bg-success = Bootstrap green
              d-flex justify-content-between = title on the left, buttons pushed to the right
              align-items-center = vertically centers them */}
          <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">Ask EBICSA</div>
              <small>your ICS advising assistant</small>
            </div>
            {/* gap-1 = small space between the two header buttons */}
            <div className="d-flex gap-1">
              {/* variant="outline-light" = white outlined button
                  aria-label = text a screen reader says, since the button only has an icon
                  onClick uses () => so setView runs WHEN clicked; onClick={setView('expanded')} would run immediately and loop forever */}
              <Button variant="outline-light" size="sm" aria-label="Expand chat" onClick={() => setView('expanded')}>
                <ArrowsAngleExpand/>
              </Button>
              <Button variant="outline-light" size="sm" aria-label="Minimize chat" onClick={() => setView('closed')}>
                <DashLg/>
              </Button>
            </div>
          </Card.Header>
          {/* maxHeight caps the message area; overflowY: 'auto' adds a scrollbar instead of the card growing off screen lol */}
          <Card.Body style={{ maxHeight: '20rem', overflowY: 'auto' }}>
            {messageList}
          </Card.Body>
        </Card>
      )}

      {/*--- Expanded Panel HERE ---*/}


      {/*--- Round Launcher Button HERE ---*/}
      <Button
        variant="success" // solid Bootstrap green button
        className="position-fixed bottom-0 end-0 m-3 rounded-circle shadow d-flex align-items-center justify-content-center" // pinned bottom-right, m-3 = space from the edges, rounded-circle = round, d-flex + align/justify center = icon centered
        style={{width: '3.5rem', height: '3.5rem', zIndex: 1060}} // equal width/height makes a perfect circle; zIndex 1060 keeps it above the dimmed backdrop of the expanded panel
        aria-label={view === 'closed' ? 'Open chat assistant' : 'Close chat assistant'} // screen reader label changes depending on the view
        onClick={() => setView(view === 'closed' ? 'mini' : 'closed')} // ternary: if closed, open the mini popup; otherwise close it
      >
        {/* shows the chat icon when closed, and an X when the chat is open */}
        {view === 'closed' ? <ChatDotsFill size={22}/> : <XLg size={20} />}
      </Button>
    </>
  );
};

export default ChatWidget;
