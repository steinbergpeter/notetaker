import type { FC, Dispatch, SetStateAction } from "react";
import { api, type RouterOutputs } from "../utils/api";
import { NoteCard } from "./NoteCard";
import { useSession } from "next-auth/react";
type Topic = RouterOutputs["topic"]["getAll"][0];

interface Props {
  selectedTopic: Topic | null;
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>;
}

const NoteCardList:FC<Props> = ({selectedTopic, setSelectedTopic}) => {
    const { data: sessionData } = useSession();

  ///// GET NOTES
  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  ///// DELETE NOTE
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  return (
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
  );
};

export default NoteCardList;
