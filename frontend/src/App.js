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

function App() {
  return (
    <div className="container mx-auto px-5 lg:px-20">
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="platform" element={<Platform />}>
                <Route index element={<Home />} />
                <Route path="feed" element={<Feed />} />
                <Route path="members" element={<MemberContext />}>
                  <Route index element={<Members />} />
                  <Route path="edit" element={<ProfileEditor />} />
                  <Route path=":memberId" element={<Profile />} />
                </Route>
                <Route path="events" element={<Events />} />
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