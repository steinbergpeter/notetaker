/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type FC } from "react";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../utils/api";
import { NoteEditor } from "./NoteEditor";
import { NoteCard } from "./NoteCard";

type Topic = RouterOutputs["topic"]["getAll"][0];

const Notes: FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  ///// GET TOPICS
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  ///// GET NOTES
  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  ///// CREATE NOTE
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  ///// DELETE NOTE
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  return (
    <div className="col-span-3">
      <div>
        {notes?.map((note) => (
          <div key={note.id} className="mt-5">
            <NoteCard
              note={note}
              onDelete={() => void deleteNote.mutate({ id: note.id })}
            />
          </div>
        ))}
      </div>

      <NoteEditor
        onSave={({ title, content }) => {
          void createNote.mutate({
            title,
            content,
            topicId: selectedTopic?.id ?? "",
          });
        }}
      />
    </div>
  );
};

export default Notes;
