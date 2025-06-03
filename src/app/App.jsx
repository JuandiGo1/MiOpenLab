import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/context/AuthContext.jsx";
import LoginPage from "../auth/pages/LoginPage";
import ExplorePage from "../explore/pages/ExplorePage";
import Navbar from "../common/components/Navbar.jsx";
import { ProtectedRoute } from "../common/components/PrivateRoute.jsx";
import ProfilePage from "../profile/pages/ProfilePage.jsx";
import EditProfile from "../profile/pages/EditProfile.jsx";
import CreateProject from "../profile/pages/CreateProject.jsx";
import ProjectDetails from "../explore/pages/ProjectDetails.jsx";
import GroupsPage from "../groups/pages/GroupsPage.jsx";
import GroupDetailsPage from "../groups/pages/GroupDetailsPage.jsx";
import CreateGroupPage from "../groups/pages/CreateGroupPage.jsx";
import CreateDiscussionPage from "../forums/pages/CreateDiscussionPage.jsx";
import DiscussionDetailsPage from "../forums/pages/DiscussionDetailsPage.jsx";
import "../App.css";
import NotificationsPage from "../notifications/pages/NotificationsPage.jsx";
import NotFound from "../common/components/NotFound.jsx";
import ForgotPasswordPage from "../auth/pages/ForgotPassworPage.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/home"
            element={
              <Navbar>
                <ExplorePage />
              </Navbar>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <Navbar>
                  <ProfilePage />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <Navbar>
                  <EditProfile />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/newproject"
            element={
              <ProtectedRoute>
                <Navbar>
                  <CreateProject />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-project/:id"
            element={
              <ProtectedRoute>
                <Navbar>
                  <CreateProject />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <Navbar>
                <ProjectDetails />
              </Navbar>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Navbar>
                  <NotificationsPage />
                </Navbar>
              </ProtectedRoute>
            }
          />
          {/* Groups Routes */}
          <Route
            path="/groups"
            element={
              <Navbar>
                <GroupsPage />
              </Navbar>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <Navbar>
                <GroupDetailsPage />
              </Navbar>
            }
          />
          <Route
            path="/groups/new"
            element={
              <ProtectedRoute>
                <Navbar>
                  <CreateGroupPage />
                </Navbar>
              </ProtectedRoute>
            }
          />
          {/* Group Discussion Routes */}
          <Route
            path="/groups/:groupId/discussions/new"
            element={
              <ProtectedRoute>
                <Navbar>
                  <CreateDiscussionPage />
                </Navbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:groupId/discussions/:discussionId"
            element={
              <Navbar>
                <DiscussionDetailsPage />
              </Navbar>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
