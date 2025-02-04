import './App.css';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

function App() {
  return (
    <>
      <a href={'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID}>Log in with Github</a>
    </>
  )
}

export default App
