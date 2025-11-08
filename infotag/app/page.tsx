'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [patientId, setPatientId] = useState('');
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nfcMessage, setNfcMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [professionalName, setProfessionalName] = useState('');
  const [justification, setJustification] = useState('');
  const router = useRouter();
  const { authenticate } = useAuth();

  useEffect(() => {
    // Verificar se o navegador suporta NFC
    if ('NDEFReader' in window) {
      setIsNFCSupported(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      setSelectedPatientId(patientId.toUpperCase());
      setShowAuthModal(true);
    }
  };

  const handleAuthenticate = () => {
    if (!professionalName.trim() || !justification.trim()) {
      alert('Por favor, preencha todos os campos de autenticação.');
      return;
    }

    const success = authenticate(selectedPatientId, justification, professionalName);
    
    if (success) {
      router.push(`/patient/${selectedPatientId}`);
    } else {
      alert('Erro na autenticação. Verifique os dados.');
    }
  };

  const handleQuickAccess = (id: string) => {
    setSelectedPatientId(id);
    setShowAuthModal(true);
  };

  const startNFCScan = async () => {
    if (!isNFCSupported) {
      setNfcMessage('❌ Seu dispositivo não suporta NFC');
      return;
    }

    try {
      setIsScanning(true);
      setNfcMessage('📱 Aproxime a pulseira do celular...');

      // @ts-ignore - Web NFC API
      const ndef = new NDEFReader();
      await ndef.scan();

      ndef.addEventListener('reading', ({ message }: any) => {
        const record = message.records[0];
        const textDecoder = new TextDecoder('utf-8');
        const patientCode = textDecoder.decode(record.data);
        
        setNfcMessage('✅ Pulseira lida com sucesso!');
        setIsScanning(false);
        setSelectedPatientId(patientCode.toUpperCase());
        setShowAuthModal(true);
      });

      ndef.addEventListener('readingerror', () => {
        setNfcMessage('❌ Erro ao ler a pulseira. Tente novamente.');
        setIsScanning(false);
      });

    } catch (error) {
      console.error('Erro NFC:', error);
      setNfcMessage('❌ Erro ao ativar NFC. Verifique as permissões.');
      setIsScanning(false);
    }
  };

  const stopNFCScan = () => {
    setIsScanning(false);
    setNfcMessage('');
  };

  const demoIds = [
    { id: 'PAC001', name: 'João Silva', icon: '👨' },
    { id: 'PAC002', name: 'Maria Santos', icon: '👩' },
    { id: 'PAC003', name: 'Pedro Oliveira', icon: '👨‍🦳' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-6 border-4 border-white/20">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-6xl animate-bounce">🏥</div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                INFOTAG
              </h1>
            </div>
            <p className="text-gray-700 text-xl font-semibold">
              Sistema de Identificação Médica de Emergência
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
              <span className="animate-pulse">⚡</span>
              <span>Acesso Rápido por NFC</span>
              <span className="animate-pulse">⚡</span>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {/* Emergency Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-4 border-red-400/30">
            <h2 className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
              <span className="animate-pulse">⚠️</span>
              ACESSO EMERGENCIAL
              <span className="animate-pulse">⚠️</span>
            </h2>
            <p className="text-xl font-semibold">
              Sistema para uso exclusivo de profissionais de saúde
            </p>
          </div>

          {/* NFC Scanner Section */}
          {isNFCSupported && (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-4 border-white/30">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
                  <span className="text-4xl">📱</span>
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-2">
                  Leitura por NFC
                </h3>
                <p className="text-gray-600 text-lg">
                  Aproxime a pulseira do seu celular
                </p>
              </div>

              {!isScanning ? (
                <button
                  onClick={startNFCScan}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-6 px-8 rounded-xl transition-all duration-300 text-xl shadow-lg transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    📡 Ativar Leitor NFC
                  </span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6 text-center">
                    <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-lg font-bold text-purple-900">{nfcMessage}</p>
                  </div>
                  <button
                    onClick={stopNFCScan}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {nfcMessage && !isScanning && (
                <div className={`mt-4 p-4 rounded-xl text-center font-bold ${
                  nfcMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {nfcMessage}
                </div>
              )}
            </div>
          )}

          {/* Manual Access Form */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-4 border-white/30">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800 mb-2">
                Acesso Manual
              </h3>
              <p className="text-gray-600 text-lg">
                Digite o código da pulseira
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="patientId" 
                  className="block text-gray-700 font-bold mb-3 text-lg"
                >
                  ID da Pulseira:
                </label>
                <input
                  type="text"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Ex: PAC001"
                  className="w-full px-6 py-4 border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-xl font-bold uppercase bg-gray-50 transition-all duration-200 hover:bg-white"
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black py-5 px-8 rounded-xl transition-all duration-300 text-xl shadow-lg transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center justify-center gap-3">
                  � Acessar Informações Médicas
                </span>
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-4 border-white/30">
            <h3 className="text-3xl font-black text-gray-800 mb-6 text-center">
              📋 Como Usar
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow">
                  1
                </div>
                <div className="text-5xl mb-3">📱</div>
                <p className="text-gray-700 font-semibold text-lg">
                  Aproxime a pulseira do celular ou escaneie QR Code
                </p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow">
                  2
                </div>
                <div className="text-5xl mb-3">🔐</div>
                <p className="text-gray-700 font-semibold text-lg">
                  Ou digite manualmente o código da pulseira
                </p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow">
                  3
                </div>
                <div className="text-5xl mb-3">⚡</div>
                <p className="text-gray-700 font-semibold text-lg">
                  Acesse instantaneamente todas as informações médicas
                </p>
              </div>
            </div>
          </div>

          {/* Demo IDs */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-400/50 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4">
                <span className="text-4xl">🧪</span>
              </div>
              <h3 className="text-3xl font-black text-green-800 mb-2">
                IDs de Demonstração
              </h3>
              <p className="text-gray-700 text-lg font-semibold">
                Clique para testar o sistema
              </p>
            </div>
            <div className="grid gap-4">
              {demoIds.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => handleQuickAccess(demo.id)}
                  className="group relative bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-4 border-green-300 hover:border-green-500 rounded-xl p-6 transition-all duration-300 flex items-center justify-between transform hover:scale-105 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{demo.icon}</div>
                    <div className="text-left">
                      <code className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-mono font-black text-xl block mb-2 shadow-md">
                        {demo.id}
                      </code>
                      <span className="text-gray-700 text-xl font-bold">{demo.name}</span>
                    </div>
                  </div>
                  <div className="text-4xl text-green-600 group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-4 border-white/30 inline-block">
            <p className="text-xl font-black text-gray-800 mb-2">
              💚 © 2025 INFOTAG - Salvando vidas com tecnologia
            </p>
            <p className="text-lg text-red-600 font-black flex items-center justify-center gap-2 mb-3">
              <span className="animate-pulse">📞</span>
              Em caso de dúvidas: 0800-INFOTAG
            </p>
            <button
              onClick={() => router.push('/audit')}
              className="text-sm text-gray-500 hover:text-gray-700 font-semibold transition duration-200"
            >
              🔒 Acesso Administrativo (Logs)
            </button>
          </div>
        </footer>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border-4 border-blue-500 animate-slide-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                <span className="text-4xl">🔐</span>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                Autenticação Necessária
              </h2>
              <p className="text-gray-600 text-lg">
                Para acessar o paciente <code className="bg-blue-100 px-3 py-1 rounded font-mono font-bold text-blue-800">{selectedPatientId}</code>
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-yellow-900 mb-1">Acesso Auditado</p>
                  <p className="text-sm text-yellow-800">
                    Este acesso será registrado com data, hora e justificativa. 
                    O uso indevido de informações médicas é crime.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  Seu Nome Completo:
                </label>
                <input
                  type="text"
                  value={professionalName}
                  onChange={(e) => setProfessionalName(e.target.value)}
                  placeholder="Ex: Dr. João Silva"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  Justificativa do Acesso:
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Ex: Atendimento de emergência - SAMU"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setProfessionalName('');
                  setJustification('');
                  setSelectedPatientId('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl transition duration-200 text-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAuthenticate}
                disabled={!professionalName.trim() || !justification.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔓 Acessar Prontuário
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Ao continuar, você concorda que seu acesso será registrado
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
