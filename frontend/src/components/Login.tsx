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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const requestToken = useCallback(() => {
    console.log('Sending token request...');
    setLoading(true);
    api.post(
      'auth/email/', { email }
    ).then(response => {
      setErrorText('');
      setWaitingForToken(true);
      setLoading(false);
    }).catch(res => {
      console.log(res);
      setErrorText(
        "An error occurred communicating with the server. Please refresh and try again, " + 
        "or if you continue to have issues let us know at hello@clydemc.org."
      )
      setLoading(false);
    })
  }, [email, setWaitingForToken]);
  
  const sendLogin = useCallback(() => {
    console.log('Sending login request...');
    setLoading(true);
    api.post(
      'auth/token/', { email, token }
    ).then(response => {
      setErrorText('');
      setAuthToken(response.data.token);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
      if (err.response.data.token) {
        setErrorText("The token you entered did not match! Please check you've used the most recent token you've received, or refresh the page and try again. It can take a few minutes for a new token to arrive.")
      } else {
        setErrorText("An unknown error occured - please refresh and try again. If you continue to have issues, contact hello@clydemc.org.");
      }
    })
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
        className={"block mx-auto rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 " + (loading ? "bg-gray-500" : "")}
        onClick={waitingForToken ? sendLogin : requestToken}>Login/Signup</button>
      {errorText && <p className="text-sm text-red-500 text-center mt-4">{errorText}</p>}
      <p className="text-sm italic text-gray-500 text-center mt-4">By accessing this area of our site you consent 
        to storing of your data as in our <span className="text-blue-800 hover:text-blue-500"><Link to="/privacy">Privacy Policy</Link></span>.</p>
    </form>
  )
}