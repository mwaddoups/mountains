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

function App() {
  return (
    <div className="container mx-auto px-4">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/">
            <Route index element={<Landing />} />
            <Route path="members" element={<Platform />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
