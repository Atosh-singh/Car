import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CRMLayout from "../layouts/CRMLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Leads from "../pages/leads/Leads";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import CreateUser from "../pages/users/CreateUser";
import CreateRole from "../pages/roles/CreateRole";
import CreatePermission from "../pages/permissions/CreatePermission";
import CreateTeam from "../pages/teams/CreateTeam";
import Cars from "../pages/cars/Cars";

import Users from "../pages/users/Users";
import Teams from "../pages/teams/Teams";
import Roles from "../pages/roles/Roles";
import Permissions from "../pages/permissions/Permissions";

import Profile from "../pages/users/Profile";
import EditProfile from "../pages/users/EditProfile";
import PermissionMatrix from "../pages/admin/PermissionMatrix";

import GoogleMeet from "../pages/GoogleMeet/GoogleMeet";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Dashboard />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Leads />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Users />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <CreateUser />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Teams />
              </CRMLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/teams/create"
  element={
    <ProtectedRoute>
      <CRMLayout>
        <CreateTeam />
      </CRMLayout>
    </ProtectedRoute>
  }
/>
        

        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Roles />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/roles/create"
  element={
    <ProtectedRoute>
      <CRMLayout>
        <CreateRole />
      </CRMLayout>
    </ProtectedRoute>
  }
/>

        <Route
          path="/permissions"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Permissions />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/permissions/create"
  element={
    <ProtectedRoute>
      <CRMLayout>
        <CreatePermission />
      </CRMLayout>
    </ProtectedRoute>
  }
/>

        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Cars />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Profile />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <EditProfile />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/google-meet"
  element={
    <ProtectedRoute>
      <CRMLayout>
        <GoogleMeet />
      </CRMLayout>
    </ProtectedRoute>
  }
/>

        <Route
  path="/admin/permissions"
  element={
    <ProtectedRoute>
      <CRMLayout>
        <PermissionMatrix />
      </CRMLayout>
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;