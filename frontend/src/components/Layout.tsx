import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import api from "../api";
import { FullUser, AuthContext } from "../models";
import Navigation from "./Navigation";

export default function Landing() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);

  useEffect(() => {
    if (authToken) {
      console.log(`Fetching user for ${authToken}...`)
      api.get('users/self').then(res => setCurrentUser(res.data))
    }
  }, [authToken])

  const storeAuth = useCallback(token => {
    console.log('Storing authorization token...')
    localStorage.setItem('token', token);
    setAuthToken(token);
  }, [setAuthToken])

  const logout = useCallback(() => {
    console.log('Logging out...')
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
  }, [setAuthToken])

  const authContext = {currentUser, authToken, storeAuth, logout, setCurrentUser}


  return (
    <>
    <Navigation authContext={authContext} />
    <div className="min-h-screen">
      <Outlet context={authContext} />
    </div>
    </>
  )
}

export function useAuth() {
  return useOutletContext<AuthContext>();
}
