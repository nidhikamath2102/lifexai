'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from './AuthModal';

interface AuthModalContextType {
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [onAuthSuccess, setOnAuthSuccess] = useState<(() => void) | undefined>(undefined);

  const openAuthModal = (onSuccess?: () => void) => {
    setIsAuthModalOpen(true);
    if (onSuccess) {
      setOnAuthSuccess(() => onSuccess);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setOnAuthSuccess(undefined);
  };

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, isAuthModalOpen }}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onSuccess={handleAuthSuccess} 
      />
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
