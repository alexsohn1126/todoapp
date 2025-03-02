import { useContext } from "react";
import "./App.css";
import { UserNameContext } from "./UserNameContext.tsx";

function App() {
  const userName = useContext(UserNameContext);

  return <p>hihi, {userName}</p>;
}

export default App;
