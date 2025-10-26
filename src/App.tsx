import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "src/pages/Home";
import LocationDetails from "src/pages/LocationDetails";
import Profile from "src/pages/Profile";
import Auth from "src/pages/Auth";
import Header from "src/components/Header";
import Footer from "src/components/Footer";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locations/:id" element={<LocationDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
