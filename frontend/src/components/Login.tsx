import React, { useCallback, useState } from "react";
import api from "../api";

interface LoginProps {
  setAuthToken: (a: string | null) => void;
}

export default function Login({ setAuthToken }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [waitingForToken, setWaitingForToken] = useState(false);

  const requestToken = useCallback(() => {
    console.log('Sending token request...');
    api.post(
      'auth/email/', { email }
    ).then(response => {
      console.log(response);
      setWaitingForToken(true);
    }).catch(res => console.log(res))
  }, [email, setWaitingForToken]);
  
  const sendLogin = useCallback(() => {
    console.log('Sending login request...');
    api.post(
      'auth/token/', { email, token }
    ).then(response => {
      setAuthToken(response.data.token);
    }).catch(res => console.log(res))
  }, [email, token, setAuthToken]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}/>
      {waitingForToken && (
        <>
        <label htmlFor="token">Token (check email)</label>
        <input type="number" id="token" value={token} onChange={event => setToken(event.target.value)} />
        </>
      )}
      <button onClick={waitingForToken ? sendLogin : requestToken}>Login/Signup</button>
    </form>
  )
}