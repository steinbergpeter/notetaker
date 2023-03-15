import { ChangeEvent, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const handleCodeChange = (value: string) => setContent(value);
  const handleSave = () => {
    onSave({
      title,
      content,
    });
    setContent("");
    setTitle("");
  };
  const isButtonDisabled = title.trim().length * content.trim().length === 0;
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            name="title"
            className="input-primary input input-lg w-full font-bold"
            placeholder="Note Title"
            value={title}
            onChange={handleTitleChange}
          />
        </h2>
        <CodeMirror
          value={content}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={handleCodeChange}
          className="border border-gray-300"
        />
        <button
          onClick={handleSave}
          className="btn-primary btn"
          disabled={isButtonDisabled}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
