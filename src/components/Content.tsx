/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSession } from "next-auth/react";
import { useState, type FC, type KeyboardEvent } from "react";
import NoteEditor from "./NoteEditor";
import { api, type RouterOutputs } from "~/utils/api";
type Topic = RouterOutputs["topic"]["getAll"][0];

const Content: FC = () => {
  const { data: sessionData } = useSession();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => setSelectedTopic(selectedTopic ?? data[0] ?? null),
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => void refetchTopics(),
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  /////////// IS THIS RIGHT????? ////////////
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const handleSaveNote = ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    void createNote.mutate({
      title,
      content,
      topicId: selectedTopic?.id ?? "",
    });
  };

  const handleAddTopic = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!sessionData?.user) {
      setIsUnauthorized(true);
    }
    if (e.key === "Enter") {
      createTopic.mutate({
        title: e.currentTarget.value,
      });
      e.currentTarget.value = "";
      setIsUnauthorized(false);
    }
  };

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a href="#" onClick={() => setSelectedTopic(topic)}>
                {topic.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="divider" />

        <input
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={handleAddTopic}
        />
        {isUnauthorized && (
          <div>
            <p>you must be logged in to add a topic</p>
            <button
              className="cursor-pointer rounded-md bg-red-500 px-2 text-white"
              onClick={() => setIsUnauthorized(false)}
            >
              clear
            </button>
          </div>
        )}
      </div>
      <div className="col-span-3">
        <NoteEditor onSave={handleSaveNote} />
      </div>
    </div>
  );
};

export default Content;
