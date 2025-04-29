import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/context/AuthContext.jsx";
import LoginPage from "../auth/pages/LoginPage";
import ExplorePage from "../explore/pages/ExplorePage";
import Navbar from "../common/components/Navbar.jsx";
import { ProtectedRoute } from "../common/components/PrivateRoute.jsx";
import ProfilePage from "../profile/pages/ProfilePage.jsx";
import "../App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <Navbar>
                <ExplorePage />
              </Navbar>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ProfilePage />
                </Navbar>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
