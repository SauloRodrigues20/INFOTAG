'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type AccessLog = {
  patientId: string;
  timestamp: Date;
  justification: string;
  professionalName: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  currentPatientId: string | null;
  professionalName: string;
  authenticate: (patientId: string, justification: string, name: string) => boolean;
  logout: () => void;
  canAccessPatient: (patientId: string) => boolean;
  accessLogs: AccessLog[];
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [professionalName, setProfessionalName] = useState('');
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  // Carregar logs do localStorage ao iniciar
  useEffect(() => {
    const savedLogs = localStorage.getItem('infotag_access_logs');
    if (savedLogs) {
      const logs = JSON.parse(savedLogs);
      setAccessLogs(logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })));
    }
  }, []);

  const authenticate = (patientId: string, justification: string, name: string): boolean => {
    if (!justification.trim() || !name.trim()) {
      return false;
    }

    const newLog: AccessLog = {
      patientId,
      timestamp: new Date(),
      justification: justification.trim(),
      professionalName: name.trim()
    };

    const updatedLogs = [...accessLogs, newLog];
    setAccessLogs(updatedLogs);
    
    // Salvar logs no localStorage
    localStorage.setItem('infotag_access_logs', JSON.stringify(updatedLogs));

    setIsAuthenticated(true);
    setCurrentPatientId(patientId);
    setProfessionalName(name);

    // Session expira em 30 minutos
    setTimeout(() => {
      logout();
    }, 30 * 60 * 1000);

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPatientId(null);
    setProfessionalName('');
  };

  const canAccessPatient = (patientId: string): boolean => {
    return isAuthenticated && currentPatientId === patientId;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        currentPatientId, 
        professionalName,
        authenticate, 
        logout, 
        canAccessPatient,
        accessLogs 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
