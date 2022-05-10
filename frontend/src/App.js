import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Landing from "./components/landing/Landing";
import Platform from "./components/Platform";
import Footer from "./components/Footer";
import Members from "./components/members/Members";
import Events from "./components/events/Events";
import Profile from "./components/members/Profile";
import ProfileEditor from "./components/members/ProfileEditor";
import Layout, { useAuth } from "./components/Layout";
import Home from "./components/Home";
import Albums from "./components/photos/Albums";
import CookieConsent from "react-cookie-consent";
import Privacy from "./components/Privacy";
import Photos from "./components/photos/Photos";
import KitList from "./components/KitList";
import JoinClub from "./components/JoinClub";
import Committee from "./components/Committee";
import EventEditor from "./components/events/EventEditor";
import Faqs from "./components/landing/Faqs";
import CommitteePage from "./components/landing/CommitteePage";

function App() {
  return (
    <div className="container mx-auto pr-2 xl:px-20">
      <CookieConsent>This website uses cookies to manage our user experience.</CookieConsent>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="faq" element={<Faqs />} />
              <Route path="committee" element={<CommitteePage />} />
              <Route path="platform" element={<Platform />}>
                <Route index element={<Home />} />
                <Route path="committee" element={<Committee />} />
                <Route path="members" element={<MemberContext />}>
                  <Route index element={<Members />} />
                  <Route path="edit" element={<ProfileEditor />} />
                  <Route path=":memberId" element={<Profile />} />
                </Route>
                <Route path="events" element={<MemberContext />}>
                  <Route index element={<Events />} />
                  <Route path=":eventId" element={<Events />} />
                  <Route path="new" element={<EventEditor />} />
                  <Route path=":eventId/edit" element={<EventEditor />} />
                </Route>
                <Route path="photos" element={<MemberContext />}>
                  <Route index element={<Albums />} />
                  <Route path=":albumId" element={<Photos />} />
                </Route>
                <Route path="kitlist" element={<KitList />} />
                <Route path="join" element={<JoinClub />} />
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
