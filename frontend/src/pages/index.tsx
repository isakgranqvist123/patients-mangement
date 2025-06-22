import { Link, Outlet } from 'react-router';
import { Button } from '../components/ui/button';
import { AuthProvider, useAuth } from '../context/auth.context';
import { Toaster } from '../components/ui/sonner';

function MainNav() {
  const auth = useAuth();

  return (
    <nav className="flex p-4 bg-secondary text-secondary-foreground ">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          {auth.isAuthenticated && (
            <Link to="/patients">
              <Button variant="ghost">Patients</Button>
            </Link>
          )}
        </div>
        <div>
          {auth.isAuthenticated ? (
            <Button variant="ghost" onClick={auth.signOut}>
              Sign Out
            </Button>
          ) : (
            <Link to="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function MainOutlet() {
  return (
    <AuthProvider>
      <MainNav />

      <Toaster richColors position="top-center" />

      <div className="container bg-background mx-auto p-4">
        <Outlet />
      </div>
    </AuthProvider>
  );
}
