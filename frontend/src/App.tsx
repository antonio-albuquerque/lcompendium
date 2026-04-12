import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CompendiumPage from "./pages/CompendiumPage";
import UploadPage from "./pages/UploadPage";
import EntryDetailPage from "./pages/EntryDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CompendiumPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/entries/:id" element={<EntryDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
