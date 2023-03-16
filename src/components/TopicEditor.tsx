import { api, type RouterOutputs } from "../utils/api";
import { useState, type FC } from "react";
import { useSession } from "next-auth/react";

type Topic = RouterOutputs["topic"]["getAll"][0];

const TopicEditor: FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

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

  ///// CREATE TOPIC
  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  return (
    <input
      type="text"
      placeholder="New Topic"
      className="input-bordered input input-sm w-full"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          createTopic.mutate({
            title: e.currentTarget.value,
          });
          e.currentTarget.value = "";
        }
      }}
    />
  );
};

export default TopicEditor;
