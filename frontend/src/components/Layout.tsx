import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import api from "../api";
import { FullUser, AuthContext } from "../models";
import Navigation from "./Navigation";

export default function Layout() {
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
    if (authToken) {
      refreshUser();
    }
  }, [authToken, refreshUser])

  const storeAuth = useCallback(async token => {
    console.log('Storing authorization token...')
    localStorage.setItem('token', token);
    setAuthToken(token);
    await refreshUser();
  }, [refreshUser, setAuthToken])

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
