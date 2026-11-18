// This component will be the *widget* itself, we will implement the real circular launcher, mini popup, then expanded view
'use client';

import { Button, Card, Form, InputGroup, Offcanvas } from "react-bootstrap";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types"; //import type means this is only used for type checking; not importing something like a component or function
import { useState } from "react"; // useState gives the component a "memory" that survives re-renders; changing it redraws the component
import { ArrowRight, ArrowsAngleContract, ArrowsAngleExpand, ChatDotsFill, DashLg, XLg } from "react-bootstrap-icons"; 
import { getAssistantReply } from "./placeholderReplies";

type ChatView = 'closed' | 'mini' | 'expanded'; // the only 3 views the widget can be in

const sampleMessages: Message[] = [
  { id: 1, role: 'user', text: 'Do I need ICS 241 before ICS 311?'},
  { id: 2, role: 'assistant', text:"Yes. ICS 311 (Algorithms) lists ICS 241 as a prerequisite. You've finished ICS 141, so you can take ICS 241 next term."},
  { id: 3, role: 'user', text: 'Thanks!' },
  { id: 4, role: 'assistant', text:"Gg ferkin ez"},
  { id: 5, role: 'user', text:"hey"},
  { id: 6, role: 'assistant', text:"u da copycat"}
]; //hmmm this is just an array version that simplifies the process of mapping messages

// makes a unique id for a new message (the current time in ms).
// outside the component so that the impure error doesn't pop up
const makeId = () => Date.now();

// block body => { } instead of => ( ) because we need to run code (useState, messageList) before returning
const ChatWidget = () => {
  // view = the current value, setView = the function that changes it. starts as 'closed'
  // dont write view = 'mini' directly; React dont like that
  const [view, setView] = useState<ChatView>('closed');
  // Making changes that allow added messages to live in state
  const [messages, setMessages] = useState<Message[]>(sampleMessages); // the conversation which starts w/ current sample messsages
  const [draft, setDraft] = useState(''); // whatever is typed into our input box
  const [isTyping, setIsTyping] = useState(false); // true iff waiting for assistant to reply back (modify later when implementing real AI)

  //adds a user msg to the chat, then async allows us to put await inside which waits for the reply, then adds it to the arr
  const sendMessage = async (text: string) => {
    const trimmed = text.trim(); //removes spaces at the start/end, so "  " counts as empty
    if (trimmed === '' || isTyping) return; //ignore empty messages and don't send inputs when assistant is formulating reply

    const newMessage: Message = {id: makeId(), role: 'user', text: trimmed };
    const history = [...messages, newMessage]; //full conversation to send to AI

    setMessages((prev) => [...prev, newMessage]); //show user's message asap
    setIsTyping(true); //show the "typing..." message

    // try runs the code
    try { 
      const replyData = await getAssistantReply(history) //{ text, courses?, suggestions? }
      const reply: Message = {id: makeId(), role: 'assistant', ...replyData };  // ...replyData copies text/courses/suggestions in
      setMessages((prev) => [...prev, reply]); //show assisstant's reply asap
    } catch { //runs only if something in *try*, in this case getAssistantReply, throws an error... like no wifi or AI API is down
      const errReply: Message = {id: makeId(), role: 'assistant', text: "Sorry, we ran into an issue. Please wait and try again later." };
      setMessages((prev) => [...prev, errReply]);
    } finally { //always runs 
      setIsTyping(false); //this is so that "typing..." never gets stuck 
    }
  };

  // for above; why not messages.push(newMessage)? this is bc push modifies the existing array 
  // React decides whether to re-render by checking "is this a different array than before?" 
  // with push it's still the same array, so React thinks nothing changed and doesn't remake it


    // runs when the form is submitted (Enter key or clicking the send button)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // stop the browser from reloading the page (default form behavior)
    sendMessage(draft);
    setDraft(''); // clear the input box
  };



  // JSX can be stored in a variable; built once here so both the mini popup and expanded panel can show {messageList}
  const messageList = messages.map((message) => (
    <ChatMessage key={message.id} role={message.role} text={message.text} courses={message.courses}/>
  ));

  const lastMessage = messages[messages.length - 1];
  const suggestionChips = !isTyping && lastMessage.suggestions && (
    <div className="d-flex flex-wrap gap-2 mt-1 mb-2">
      {lastMessage.suggestions.map((suggestion) => (
        <Button key={suggestion} variant="outline-success" size="sm" className="rounded-pill" onClick={() => sendMessage(suggestion)}>
          {suggestion}
        </Button>
      ))}
    </div>
  );

  //adding up existing messages & "typing..." bubble while waiting for reply, then the little suggestion blobs after
  const conversation = (
    <>
      {messageList}
      {isTyping && <ChatMessage role="assistant" text="EBICSA is typing..."></ChatMessage>}
      {suggestionChips}
    </>
  );


  // this is the input box & send button, stored in a var so both the mini popup and expanded view can use it
  const inputBox = (
    <Form onSubmit ={handleSubmit}>
      <InputGroup> {/* puts the text box and button together into one rounded bar lie the mockup */}
        <Form.Control 
          placeholder="What's got u so worked up?" 
          aria-label="Message the chat assistant" 
          value={draft} 
          onChange={(event) => setDraft(event.target.value)} // onChange={. . .} means that on every keystroke, draft is updated to what's in the box. event.target is the input element, and .value is its current text
        />
        <Button type="submit" variant="success" aria-label="Send message" disabled={draft.trim() === '' || isTyping}> {/* the disabled={} greys out button when box is empty AND when assistant is typing a response*/}
          <ArrowRight/>
        </Button>
      </InputGroup>
    </Form>
  );

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
            {conversation}
          </Card.Body>
          <Card.Footer className="bg-white">{inputBox}</Card.Footer>
        </Card>
      )}

      {/*--- Expanded Panel HERE ---*/}
      <Offcanvas show={view === 'expanded'} onHide={() => setView('closed')} placement="end" className="w-100">
        <Offcanvas.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <div>
            <Offcanvas.Title className="fw-bold">Ask EBICSA</Offcanvas.Title>
            <small>your ICS advising assistant</small>
          </div>
          <div className="d-flex gap-1">
            <Button variant="outline-light" size="sm" aria-label="Shrink chat" onClick={() => setView('mini')}>
              <ArrowsAngleContract/>
            </Button>
            <Button variant="outline-light" size="sm" aria-label="Minimize chat" onClick={() => setView('closed')}>
              <DashLg/>
            </Button>
          </div>
        </Offcanvas.Header>
        {/* d-flex flex-column stacks messages and input vertically */}
        <Offcanvas.Body className="d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">{conversation}</div>
          <div className="pt-3 border-top">{inputBox}</div>
        </Offcanvas.Body>
      </Offcanvas>

      {/*--- Round Launcher Button HERE ---*/}
      {view !== 'expanded' && (
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
      )}
    </>
  );
};

export default ChatWidget;
