import type { FC, MouseEvent, SetStateAction, Dispatch } from "react";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../utils/api";

type Topic = RouterOutputs["topic"]["getAll"][0];

interface Props {
  selectedTopic: Topic | null;
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>;
}

const TopicsList: FC<Props> = ({ selectedTopic, setSelectedTopic }) => {
  const { data: sessionData } = useSession();

  const handleSelectTopic = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    topic: Topic
  ) => {
    setSelectedTopic(topic);
  };

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
          <a
            className={
              topic.id === selectedTopic?.id
                ? "bg-blue-800 text-white"
                : " bg-white hover:bg-blue-200"
            }
            href="#"
            onClick={(e) => handleSelectTopic(e, topic)}
          >
            {topic.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default TopicsList;
