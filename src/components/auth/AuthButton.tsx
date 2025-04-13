'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from './AuthModalController';

export default function AuthButton() {
  const { isAuthenticated, username, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="hover:text-blue-200"
          >
            {username}, logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => openAuthModal()}
          className="hover:text-blue-200"
        >
          Login
        </button>
      )}
    </>
  );
}
