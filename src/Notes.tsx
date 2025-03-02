import { useContext, useEffect, useState } from "react";
import { useGithubRequest } from "./utils";
import { UserNameContext } from "./UserNameContext";

interface repo {
  id: number;
  name: string;
}

function Notes() {
  const userName = useContext(UserNameContext);
  const [data] = useGithubRequest(`/users/${userName}/repos`, [userName]);
  const [repos, setRepos] = useState<repo[]>([]);

  useEffect(() => {
    if (!Array.isArray(data)) return;

    setRepos(data);
  }, [data]);

  return (
    <div>
      <p>repos for {userName}</p>
      {repos.map((repo) => {
        return <p key={repo.id}>{repo.name}</p>;
      })}
    </div>
  );
}

export default Notes;
