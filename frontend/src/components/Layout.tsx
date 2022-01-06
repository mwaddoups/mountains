import React, { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import api from "../api";
import { User } from "../models";
import Navigation from "./Navigation";

type AuthContext = { 
  authToken: string,
  setAuthToken: (a: string) => void,
  currentUser: User,
}

export default function Landing() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (authToken) {
      console.log(authToken)
      api.get('users/self').then(res => setCurrentUser(res.data))
    }
  }, [authToken])

  return (
    <>
    <Navigation />
    <div className="min-h-screen">
      <Outlet context={{currentUser, authToken, setAuthToken}} />
    </div>
    </>
  )
}

export function useAuth() {
  return useOutletContext<AuthContext>();
}
