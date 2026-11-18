// Suggesterd by AI to include as a course viewer within widget; may remove this before M2/M3
import { Button } from 'react-bootstrap';
import type { Course } from './types';

type CourseCardProps = {
  course: Course; // the whole course object as ONE prop, instead of 5 separate props
};


// format is subject to change, because I want it to look less generic, or if it looks too "AI"-like
// TODO: change line 19 (with the checkmark) to be an X or ✓ depending on whether you have that as a prerequisite from your transcript
const CourseCard = ({ course }: CourseCardProps) => (
  <div className="d-flex justify-content-between align-items-center border rounded-3 bg-white px-3 py-2 mb-2">
    <div>
      <div>
        <span className="fw-bold">{course.code}</span> · {course.title}
      </div>
      <small className="text-muted">
        {course.credits} credits · <span className="text-success">✓ {course.prerequisite}</span> · {course.pathway} 
      </small>
    </div>
    {/* doesn't go anywhere yet- later it can link to the course page we're still building */}
    <Button variant="link" size="sm" className="text-success">
      View
    </Button>
  </div>
);

export default CourseCard;
