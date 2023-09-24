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
import AlbumCreator from "./components/photos/AlbumCreator";
import CookieConsent from "react-cookie-consent";
import Privacy from "./components/Privacy";
import Photos from "./components/photos/Photos";
import KitList from "./components/KitList";
import JoinClub from "./components/JoinClub";
import Committee from "./components/Committee";
import EventEditor from "./components/events/EventEditor";
import Resources from "./components/Resources";
import Faqs from "./components/landing/Faqs";
import CommitteePage from "./components/landing/CommitteePage";
import Activity from "./components/Activity";
import Reports from "./components/reports/Reports";
import SingleReport from "./components/reports/SingleReport";
import ReportEditor from "./components/reports/ReportEditor";

function App() {
  return (
    <div className="container mx-auto xl:px-20">
      <CookieConsent>This website uses cookies to manage our user experience.</CookieConsent>
      <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="faq" element={<Faqs />} />
              <Route path="committee" element={<CommitteePage />} />
              <Route path="reports" element={<MemberContext />}>
                <Route index element={<Reports />} />
                <Route path=":reportId" element={<SingleReport />} />
                <Route path="new" element={<ReportEditor />} />
                <Route path=":reportId/edit" element={<ReportEditor />} />
              </Route>
              <Route path="platform" element={<Platform />}>
                <Route index element={<Home />} />
                <Route path="committee" element={<Committee />} />
                <Route path="activity" element={<Activity />} />
                <Route path="members" element={<MemberContext />}>
                  <Route index element={<Members />} />
                  <Route path="edit" element={<ProfileEditor />} />
                  <Route path=":memberId" element={<Profile />} />
                </Route>
                <Route path="events" element={<MemberContext />}>
                  <Route index element={<Events />} />
                  <Route path=":eventId" element={<Events />} />
                  <Route path="new" element={<EventEditor copyFrom={false}/>} />
                  <Route path=":eventId/edit" element={<EventEditor copyFrom={false} />} />
                  <Route path=":eventId/copy" element={<EventEditor copyFrom={true} />} />
                </Route>
                <Route path="photos" element={<MemberContext />}>
                  <Route index element={<Albums />} />
                  <Route path="new" element={<AlbumCreator />} />
                  <Route path=":albumId" element={<Photos />} />
                </Route>
                <Route path="kitlist" element={<KitList />} />
                <Route path="resources" element={<Resources />}/>
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
