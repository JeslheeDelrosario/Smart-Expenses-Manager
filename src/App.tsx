import { BrowserRouter, Routes, Route } from "react-router-dom";
// Remove: import Landing from ...  (unless you actually use it later)

// If you have a LandingPage component, import it like this:
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more <Route> components here as needed */}
        {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;