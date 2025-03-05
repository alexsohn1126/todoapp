import { useContext, useEffect, useState } from "react";
import { useGithubRequest } from "./utils";
import { UserNameContext } from "./UserNameContext";
import { Link } from "react-router";

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
    <>
      <div className="flex flex-col">
        <p>repos for {userName}</p>
        {repos.map((repo) => {
          return (
            <Link to={`/notes/${repo.name}`} key={repo.id}>
              {repo.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Notes;
