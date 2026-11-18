// This will be the one chat bubble; where user messages are on the righthand side
// the chat assistant will be on the left 

import CourseCard from "./CourseCard";
import { Course } from "./types";

type ChatMessageProps = { // describes props this component accepts
  role: 'user' | 'assistant'; 
  text: string;
  courses?: Course[]; // optional: course cards to show under the bubble
};

const ChatMessage = ({ role, text, courses }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className="mb-2">
    <div className={`d-flex mb-2 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>  
      <div
        className={`px-3 py-2 rounded-3 ${isUser ? 'bg-success text-white' : 'bg-white border'}`}
        style={{maxWidth: '80%'}}>
          {text}
      </div>
    </div>

    {/* Only if this message HAS courses and the list isn't empty */}
    {courses && courses.length > 0 && (
      <div className="mt-2">
        {courses.map((course) => (<CourseCard key={course.code} course={course}/>))}
      </div>
    )}
    </div>
  );
};

// ${isUser ? 'justify-content-end' : 'justify-content-start'}`} determines which text message belongs to what side, user's or assistant 
// within className, {} in JSX means to run JS there.
// backticks, `Bootstrap class`, make a template string

// in the style={{maxWidth}}, outer braces are the JS rule, and inner braces are an object
// refresher: CSS property names are camelCase in React

// no 'use-client' here because a component imported by a client component automatically runs on the client as well

export default ChatMessage;