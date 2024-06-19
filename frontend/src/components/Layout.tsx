import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import api from "../api";
import { FullUser, AuthContext } from "../models";
import Navigation from "./Navigation";
import Cookies from "universal-cookie";
import ReactGA from "react-ga4";

export default function Layout() {
  usePageTracking();

  const [authToken, setAuthToken] = useState<string | null>(
    fetchTokenFromStorage()
  );
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);

  const logout = useCallback(() => {
    console.log("Logging out...");
    const cookies = new Cookies();
    cookies.remove("token", { sameSite: "strict" });
    localStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
  }, [setAuthToken]);

  const refreshUser = useCallback(async () => {
    if (authToken) {
      console.log(`Fetching user for ${authToken}...`);
      try {
        const res = await api.get("users/self/");
        if (res.status !== 200) {
          throw res.data;
        }
        setCurrentUser(res.data);
      } catch (err) {
        logout();
      }
    }
  }, [authToken, logout]);

  useEffect(() => {
    if (authToken) {
      refreshUser();
    }
  }, [authToken, refreshUser]);

  const storeAuth = useCallback(
    async (token) => {
      let expiry = new Date(new Date().setDate(new Date().getDate() + 90));
      console.log("Storing authorization token...");
      const cookies = new Cookies();
      cookies.set("token", token, {
        path: "/",
        secure: true,
        sameSite: "strict",
        expires: expiry,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("token-expiry", expiry.toISOString());
      setAuthToken(token);
      await refreshUser();
    },
    [refreshUser, setAuthToken]
  );

  const authContext = {
    currentUser,
    authToken,
    storeAuth,
    logout,
    refreshUser,
  };

  return (
    <>
      <Navigation authContext={authContext} />
      <div className="min-h-screen">
        <Outlet context={authContext} />
      </div>
    </>
  );
}

export function useAuth() {
  return useOutletContext<AuthContext>();
}

const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (window.location.href.includes("clydemc")) {
      ReactGA.initialize("G-Y9C9ZH33ZE");
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [initialized, location]);
};

const fetchTokenFromStorage: () => string | null = () => {
  const cookies = new Cookies();
  let token: string | null;
  let tokenExpiry: string | null;
  if ((token = cookies.get("token")) !== null) {
    return token;
  } else if ((tokenExpiry = localStorage.getItem("token-expiry")) !== null) {
    let expiryDate = new Date(tokenExpiry);
    let currentDate = new Date();
    if (expiryDate > currentDate) {
      return localStorage.getItem("token");
    } else {
      console.log("Storage token expired, requiring new login...");
      localStorage.clear();
      return null;
    }
  } else {
    // Token with no expiry-token, treated as null
    localStorage.clear();
    return null;
  }
};
