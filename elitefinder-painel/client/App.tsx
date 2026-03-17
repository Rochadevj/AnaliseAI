import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Sessoes from "./pages/Sessoes";
import Configuracoes from "./pages/Configuracoes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import NotFound from "./pages/NotFound";
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/dashboard" element={<Index />} /> 
      <Route path="/sessoes" element={<Sessoes />} />
      <Route
        path="/configuracoes"
        element={
          <Configuracoes onBackToDashboard={() => window.location.href = "/dashboard"} />
        }
      />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/termos" element={<TermsOfUse />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
