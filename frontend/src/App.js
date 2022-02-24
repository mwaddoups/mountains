import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Landing from "./components/Landing";
import Platform from "./components/Platform";
import Footer from "./components/Footer";
import Members from "./components/members/Members";
import Feed from "./components/feed/Feed";
import Events from "./components/events/Events";
import Profile from "./components/members/Profile";
import ProfileEditor from "./components/members/ProfileEditor";
import Layout, { useAuth } from "./components/Layout";
import Home from "./components/Home";
import Photos from "./components/photos/Photos";
import CookieConsent from "react-cookie-consent";
import Privacy from "./components/Privacy";

function App() {
  return (
    <div className="container mx-auto pr-2 lg:px-20">
      <CookieConsent>This website uses cookies to manage our user experience.</CookieConsent>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="platform" element={<Platform />}>
                <Route index element={<Home />} />
                <Route path="feed" element={<Feed />} />
                <Route path="members" element={<MemberContext />}>
                  <Route index element={<Members />} />
                  <Route path="edit" element={<ProfileEditor />} />
                  <Route path=":memberId" element={<Profile />} />
                </Route>
                <Route path="events" element={<MemberContext />}>
                  <Route index element={<Events />} />
                  <Route path=":eventId" element={<Events />} />
                </Route>
                <Route path="photos" element={<Photos />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;


function MemberContext() {
  const authContext = useAuth();

  return <Outlet context={authContext} />
}
