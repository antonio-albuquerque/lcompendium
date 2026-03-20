import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CompendiumPage from "./pages/CompendiumPage";
import UploadPage from "./pages/UploadPage";
import EntryDetailPage from "./pages/EntryDetailPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CompendiumPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/entries/:id" element={<EntryDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
