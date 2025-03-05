import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useGithubRequest } from "./utils";
import { UserNameContext } from "./UserNameContext";
import Markdown from "react-markdown";
import Editor from "./Editor";

interface githubFile {
  type: "file" | "dir" | "symlink" | "submodule";
  encoding?: "base64";
  content?: string;
}

function Note() {
  const userName = useContext(UserNameContext);
  const { id } = useParams();
  const [noteData] = useGithubRequest(
    `/repos/${userName}/${id}/contents/README.md`,
    [userName, id]
  ) as [githubFile];
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    // Decode the content if it exists
    const decodedContent = noteData.content ? atob(noteData.content) : "";
    setContent(decodedContent);
  }, [noteData]);

  return (
    <div className="flex flex-col gap-1.5 mx-auto w-[50svw]">
      <h1>Repo: {id}</h1>
      <button className="border-2" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "View Document" : "Edit"}
      </button>
      {isEditing ? (
        <Editor value={content} onChange={setContent} />
      ) : (
        <Markdown>{content}</Markdown>
      )}
    </div>
  );
}

export default Note;
