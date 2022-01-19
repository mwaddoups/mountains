import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
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

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
  const inputStyles = "px-2 py-1 shadow border rounded w-full leading-tight focus:shadow-outline" 

  return (
    <form onSubmit={e => e.preventDefault()} className="max-w-xs mx-auto bg-white shadow-md rounded p-8 m-4">
      <div className="mb-4">
        <label htmlFor="email" className={labelStyles}>Email</label>
        <input 
          className={inputStyles} placeholder="Email"
          type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}/>
        {waitingForToken && (
          <div className="mt-4">
            <label htmlFor="token" className={labelStyles}>6-digit Token (check email)</label>
            <input 
              className={inputStyles}
              type="string" id="token" value={token} onChange={event => setToken(event.target.value)} />
          </div>
        )}
      </div>
      <button 
        className="block mx-auto rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3"
        onClick={waitingForToken ? sendLogin : requestToken}>Login/Signup</button>
      <p className="text-sm italic text-gray-500 text-center mt-4">By accessing this area of our site you consent 
        to storing of your data as in our <span className="text-blue-800 hover:text-blue-500"><Link to="/privacy">Privacy Policy</Link></span>.</p>
    </form>
  )
}