'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditPage() {
  const { accessLogs } = useAuth();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples para demo - em produção use auth real
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-2">
              Área Restrita
            </h1>
            <p className="text-gray-600">Logs de Auditoria</p>
          </div>

          <form onSubmit={handleAuth}>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Senha de Administrador:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none text-lg"
                placeholder="Digite a senha"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition duration-200 text-lg"
            >
              🔓 Acessar Logs
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition duration-200"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-gray-800 mb-2">
                📊 Logs de Auditoria
              </h1>
              <p className="text-gray-600 text-lg">
                Registro de todos os acessos ao sistema
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200"
            >
              ← Voltar
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 mb-6">
            <p className="text-blue-900 font-semibold">
              ℹ️ Total de acessos registrados: <span className="font-black text-2xl">{accessLogs.length}</span>
            </p>
          </div>
        </div>

        {accessLogs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-700">Nenhum acesso registrado ainda</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {accessLogs.slice().reverse().map((log, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-blue-600 hover:shadow-xl transition-all duration-200"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Paciente:</p>
                    <p className="text-xl font-black text-blue-800">{log.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Profissional:</p>
                    <p className="text-lg font-bold text-gray-800">{log.professionalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Data/Hora:</p>
                    <p className="text-lg font-bold text-gray-800">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">ID do Log:</p>
                    <p className="text-sm font-mono text-gray-600">#{accessLogs.length - index}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Justificativa:</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{log.justification}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
