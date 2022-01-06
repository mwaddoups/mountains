import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Landing from "./components/Landing";
import Platform from "./components/Platform";
import Footer from "./components/Footer";
import Members from "./components/Members";
import Feed from "./components/feed/Feed";
import Events from "./components/Events";
import Profile from "./components/Profile";
import ProfileEditor from "./components/ProfileEditor";
import Layout from "./components/Layout"

function App() {
  return (
    <div className="container mx-auto px-20">
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="platform" element={<Platform />}>
                <Route index element={<Feed />} />
                <Route path="members" element={<Members />} />
                <Route path="members/edit" element={<ProfileEditor />} />
                <Route path="members/:memberId" element={<Profile />} />
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
