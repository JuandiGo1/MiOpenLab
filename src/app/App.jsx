import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/context/AuthContext.jsx";
import LoginPage from "../auth/pages/LoginPage";
import ExplorePage from "../explore/pages/ExplorePage";
import "../App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<ExplorePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
