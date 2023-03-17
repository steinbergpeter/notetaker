import { api, type RouterOutputs } from "../utils/api";
import type {
  ChangeEvent,
  FormEvent,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";

type Topic = RouterOutputs["topic"]["getAll"][0];

interface Props {
  selectedTopic: Topic | null;
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>;
}

const TopicEditor: FC<Props> = ({ selectedTopic, setSelectedTopic }) => {
  const { data: sessionData } = useSession();
  const [newTopic, setNewTopic] = useState("");

  const onTopicInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTopic(e.target.value);
  };
  ///// GET TOPICS
  const { refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const submitNewTopic = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTopic.mutate({
      title: newTopic,
    });
    setNewTopic("");
  };

  return (
    <form onSubmit={submitNewTopic}>
      <input
        type="text"
        placeholder="New Topic"
        className="input-bordered input input-sm w-full"
        value={newTopic}
        onChange={onTopicInputChange}
      />
    </form>
  );
};

export default TopicEditor;
