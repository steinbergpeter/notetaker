import { type FC, useState } from "react";
import TopicsList from "./TopicsList";
import TopicEditor from "./TopicEditor";
import { useSession } from "next-auth/react";
import { type RouterOutputs } from "../utils/api";

type Topic = RouterOutputs["topic"]["getAll"][0];

const Topics: FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: sessionData } = useSession();
  const isUser = sessionData?.user !== undefined;
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 px-2 shadow-xl">
      <TopicsList
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />
      {isUser ? (
        <TopicEditor
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      ) : (
        <h2>Log in to see topics</h2>
      )}
    </div>
  );
};

export default Topics;
