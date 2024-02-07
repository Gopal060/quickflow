import DOMPurify from "dompurify";
import { useState, useEffect, useRef } from "react";

function EditableQuestionText({
  value: initialValue,
  questionTextandPlaceholderDebounced,
  questionId,
}: {
  value: string;
  questionTextandPlaceholderDebounced: (
    questionId: string,
    placeholder: string | null,
    text: string | null
  ) => void;
  questionId: string;
}) {
  const [value, setValue] = useState(initialValue);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const sanitizedHTML = DOMPurify.sanitize(target.innerHTML)
      .replace(/&nbsp;/g, " ")
      .trim();
    setValue(sanitizedHTML);
    questionTextandPlaceholderDebounced(questionId, null, sanitizedHTML);

    // Set selection range to the end
    const selection = window.getSelection();
    if (selection && contentEditableRef.current) {
      const range = document.createRange();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    // Set initial selection when the component mounts
    const selection = window.getSelection();
    if (selection && contentEditableRef.current) {
      const range = document.createRange();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  return (
    <div
      ref={contentEditableRef}
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      className={`${
        !value
          ? "before:content-['Type_form_question'] text-muted-foreground"
          : ""
      } cursor-text break-words focus:outline-none text-lg font-medium tracking-wide leading-7 mb-2 transition-colors`}
      onInput={handleInput}
    >
      {initialValue}
    </div>
  );
}

export default EditableQuestionText;
