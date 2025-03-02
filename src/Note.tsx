import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { useGithubRequest } from "./utils";
import { UserNameContext } from "./UserNameContext";

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

  // Function to decode Base64 content
  const decodeBase64Content = (encodedContent: string): string => {
    const base64WithoutNewlines = encodedContent.replace(/\n/g, "");
    return atob(base64WithoutNewlines);
  };

  // Decode the content if it exists
  const decodedContent = noteData.content
    ? decodeBase64Content(noteData.content)
    : "";

  useEffect(() => {
    console.log(decodedContent); // Log the decoded content
  }, [decodedContent]);

  return (
    <>
      <h1>Repo: {id}</h1>
      <pre>{decodedContent}</pre>
    </>
  );
  ("");
}

export default Note;
