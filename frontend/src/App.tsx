import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Onboarding from "./pages/onboarding";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate replace to="/onboarding" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;