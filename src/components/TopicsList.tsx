import { useState, type FC, type MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../utils/api";

type Topic = RouterOutputs["topic"]["getAll"][0];

const TopicsList: FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleSelectTopic = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    topic: Topic
  ) => {
    e.preventDefault();
    setSelectedTopic(topic);
  };

  ///// GET TOPICS
  const { data: topics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  return (
    <ul className="menu rounded-box w-56 bg-base-100 p-2">
      {topics?.map((topic) => (
        <li key={topic.id}>
          <a href="#" onClick={(e) => handleSelectTopic(e, topic)}>
            {topic.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default TopicsList;
