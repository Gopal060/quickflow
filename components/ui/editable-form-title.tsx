"use client";

import DOMPurify from "dompurify";
import { useState, useEffect, useRef } from "react";

function EditableFormTitle({
  value: initialValue,
  formTitleDebounced,
  formId,
}: {
  value: string;
  formTitleDebounced: (formId: string, title: string) => void;
  formId: string;
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
    formTitleDebounced(formId, sanitizedHTML);

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
        !value ? "before:content-['Type_form_title'] text-muted-foreground" : ""
      } break-words focus:outline-none text-5xl font-semibold tracking-tight transition-colors`}
      onInput={handleInput}
    >
      {initialValue}
    </div>
  );
}

export default EditableFormTitle;
