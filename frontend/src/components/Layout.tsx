import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import api from "../api";
import { FullUser, AuthContext } from "../models";
import Navigation from "./Navigation";
import Cookies from "universal-cookie";
import ReactGA from 'react-ga4';

export default function Layout() {
  usePageTracking();

  const cookies = new Cookies();
  const [authToken, setAuthToken] = useState<string | null>(cookies.get('token') || localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);

  const logout = useCallback(() => {
    console.log('Logging out...')
    const cookies = new Cookies();
    cookies.remove('token', {sameSite: "strict"});
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
  }, [setAuthToken])

  const refreshUser = useCallback(async () => {
    if (authToken) {
      console.log(`Fetching user for ${authToken}...`);
      try {
        const res = await api.get('users/self/');
        if (res.status !== 200) {
          throw res.data;
        }
        setCurrentUser(res.data);
      } catch (err) {
        logout();
      }
    }
  }, [authToken, logout])

  useEffect(() => {
    if (authToken) {
      refreshUser();
    }
  }, [authToken, refreshUser])

  const storeAuth = useCallback(async token => {
    console.log('Storing authorization token...')
    const cookies = new Cookies();
    cookies.set('token', token, {
      path: '/',
      secure: true,
      sameSite: "strict",
      expires: new Date(new Date().setDate((new Date()).getDate() + 90))
    });
    localStorage.setItem('token', token);
    setAuthToken(token);
    await refreshUser();
  }, [refreshUser, setAuthToken])

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

const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (window.location.href.includes("clydemc")) {
      ReactGA.initialize('G-Y9C9ZH33ZE');
      setInitialized(true);
    }
  }, [])

  useEffect(() => {
    if (initialized) {
      ReactGA.send({hitType: "pageview", page: location.pathname + location.search});
    }
  }, [initialized, location])
}