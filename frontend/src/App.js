import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import Platform from "./components/Platform";
import Footer from "./components/Footer";
import Members from "./components/Members";
import Feed from "./components/Feed";
import Events from "./components/Events";

function App() {
  return (
    <div className="container mx-auto px-20">
      <Router>
        <Navigation />
        <div className="min-h-screen pt-16">
          <Routes>
            <Route path="/">
              <Route index element={<Landing />} />
              <Route path="members" element={<Platform />}>
                <Route index element={<Feed />} />
                <Route path="directory" element={<Members />} />
                <Route path="events" element={<Events />} />
              </Route>
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
