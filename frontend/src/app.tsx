import { createBrowserRouter, RouterProvider } from 'react-router';
import MainOutlet from './pages';
import Home from './pages/home';
import SignIn from './pages/sign-in';
import Patients from './pages/patients';
import { AuthenticatedGuard, UnauthenticatedGuard } from './guards/guards';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainOutlet,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/sign-in',
        element: (
          <UnauthenticatedGuard redirect="/patients">
            <SignIn />
          </UnauthenticatedGuard>
        ),
      },
      {
        path: '/patients',
        element: (
          <AuthenticatedGuard redirect="/sign-in">
            <Patients />
          </AuthenticatedGuard>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
