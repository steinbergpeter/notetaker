import { type FC } from "react";
import TopicsList from "./TopicsList";
import TopicEditor from "./TopicEditor";
import { useSession } from "next-auth/react";

const Topics: FC = () => {
  const { data: sessionData } = useSession();
  const isUser = sessionData?.user !== undefined;
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 px-2 shadow-xl">
      <TopicsList />
      {isUser ? <TopicEditor /> : <h2>Log in to see topics</h2>}
    </div>
  );
};

export default Topics;
