import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "./layout/MainLayout";
const HomePage = lazy(() => {
  return import("./pages/HomePage.js");
});
const LoginPage = lazy(() => {
  return import("./pages/LoginPage.js");
});
const SignupPage = lazy(() => {
  return import("./pages/SignupPage.js");
});
const ViewPage = lazy(() => {
  return import("./pages/ViewPage.js");
});

function App() {
  const loading = <p>Loading...</p>;
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={loading}>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: "login",
          element: (
            <Suspense fallback={loading}>
              <LoginPage />
            </Suspense>
          ),
        },
        {
          path: "register",
          element: (
            <Suspense fallback={loading}>
              <SignupPage />
            </Suspense>
          ),
        },
        {
          path: "view",
          element: (
            <Suspense fallback={loading}>
              <ViewPage />
            </Suspense>
          ),
        },
        {
          path: "view/:postId",
          element: (
            <Suspense fallback={loading}>
              <ViewPage />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
