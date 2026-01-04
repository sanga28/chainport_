import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import SASAPAnalysis from "./pages/SASAPAnalysis";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import DeployService from "./pages/DeployService";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Mint from "./pages/Mint";
import MyContainers from "./pages/MyContainers";

function Layout() {
  const location = useLocation();

  // Hide navbar only on landing page
  const hideNavbar = location.pathname === "/" || location.pathname === "/explore";


  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />

        {/* WALLET-REQUIRED (LOGIC LATER) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sasapanalysis" element={<SASAPAnalysis />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/mycontainers" element={<MyContainers />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/deployservice" element={<DeployService />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}