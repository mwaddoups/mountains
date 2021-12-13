import React, { useCallback, useState } from "react";
import api from "../api";

interface LoginProps {
  setAuthToken: (a: string | null) => void;
}

export default function Login({ setAuthToken }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  
  const sendLogin = useCallback(() => {
    console.log('Sending request...');
    api.post(
      'api/accounts/login/', { email, password }
    ).then(response => {
      setAuthToken(response.data.token);
    }).catch(res => console.log(res))
  }, [email, password, setAuthToken]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}/>
      <label htmlFor="password ">Password</label>
      <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} />
      <button onClick={sendLogin}>Login</button>
    </form>
  )
}