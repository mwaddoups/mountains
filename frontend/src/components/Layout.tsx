import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import api from "../api";
import { FullUser, AuthContext } from "../models";
import Navigation from "./Navigation";

export default function Landing() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);

  const refreshUser = useCallback(async () => {
    if (authToken) {
      console.log(`Fetching user for ${authToken}...`);
      const res = await api.get('users/self');
      setCurrentUser(res.data);
    }
  }, [authToken])

  useEffect(() => {
    const f = async () => await refreshUser();
    f();
  }, [refreshUser]);

  const storeAuth = useCallback(async token => {
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

  const authContext = {currentUser, authToken, storeAuth, logout, refreshUser}


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
