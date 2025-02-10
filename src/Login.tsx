import './index.css';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

function Login() : JSX.Element{
    return <a href={'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID}>Log in with Github</a>;
}

export default Login