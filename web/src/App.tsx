import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import { ProtectedRoute } from "./components/protected-route";
import { LoginPage } from "./pages/login";
import { NavigationBar } from "./components/navigation-bar";
import { Dashboard } from "./pages/dashboard";
import { MapPage } from "./pages/call-map";
import { RegisterCallPage } from "./pages/register-call";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />, 
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <NavigationBar />
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/call-map",
    element: (
      <ProtectedRoute>
        <NavigationBar />
        <MapPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/call/new",
    element: (
      <ProtectedRoute>
        <NavigationBar />
        <RegisterCallPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/call/edit/:id",
    element: (
      <ProtectedRoute>
        <NavigationBar />
        <RegisterCallPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/",
    element: <LoginPage />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;