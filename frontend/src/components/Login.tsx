import React, { useCallback, useState } from "react";
import api from "../api";

interface LoginProps {
  setAuthToken: (a: string | null) => void;
}

export default function Login({ setAuthToken }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  
  const sendLogin = useCallback(() => {
    console.log('Sending login request...');
    let endpoint = token ? 'auth/token/' : 'auth/email/'
    api.post(
      endpoint, { email, token }
    ).then(response => {
      setAuthToken(response.data.token);
    }).catch(res => console.log(res))
  }, [email, token, setAuthToken]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}/>
      <label htmlFor="password">Token</label>
      <input type="password" id="password" value={token} onChange={event => setToken(event.target.value)} />
      <button onClick={sendLogin}>Login</button>
    </form>
  )
}