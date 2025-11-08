'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import patientsData from '@/data/patients.json';
import { useAuth } from '@/contexts/AuthContext';

type Patient = {
  id: string;
  personalInfo: {
    name: string;
    birthDate: string;
    age: number;
    gender: string;
    cpf: string;
    photo: string;
  };
  medicalInfo: {
    bloodType: string;
    height: string;
    weight: string;
    organDonor: boolean;
  };
  allergies: Array<{
    name: string;
    severity: string;
    reaction: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    time: string;
  }>;
  conditions: Array<{
    name: string;
    since: string;
    status: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    priority: number;
  }>;
  medicalHistory: Array<{
    date: string;
    description: string;
    hospital: string;
  }>;
  observations: string;
  lastUpdate: string;
};

export default function PatientPage() {
  const params = useParams();
  const router = useRouter();
  const { canAccessPatient, professionalName, logout } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const patientId = params.id as string;
    
    // Verificar se tem permissão para acessar este paciente
    if (!canAccessPatient(patientId)) {
      setAccessDenied(true);
      setLoading(false);
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
      return;
    }

    const patientData = (patientsData as Record<string, Patient>)[patientId];
    
    if (patientData) {
      setPatient(patientData);
    }
    setLoading(false);
  }, [params.id, canAccessPatient, router]);

  // Tela de acesso negado
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border-4 border-white/30 max-w-2xl mx-4">
          <div className="text-8xl mb-6 animate-pulse">🔒</div>
          <h1 className="text-4xl font-black text-red-600 mb-4">
            ACESSO NEGADO
          </h1>
          <p className="text-gray-700 text-xl mb-6">
            Você não tem permissão para acessar este paciente.
          </p>
          <div className="bg-red-100 border-2 border-red-500 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg text-red-800 mb-2">⚠️ SEGURANÇA DO SISTEMA</h2>
            <p className="text-gray-700">
              Todos os acessos são registrados e auditados. Para acessar informações de um paciente, 
              você deve fazer a autenticação adequada na página inicial.
            </p>
          </div>
          <p className="text-gray-600 mb-4">Redirecionando para página inicial...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-8 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse text-4xl">
              🏥
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">Carregando dados do paciente...</p>
          <p className="text-gray-600 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border-4 border-white/30">
            <div className="text-8xl mb-6 animate-bounce">❌</div>
            <h1 className="text-4xl font-black text-red-600 mb-4">
              Paciente Não Encontrado
            </h1>
            <p className="text-gray-700 text-xl mb-8">
              O ID <code className="bg-red-100 px-4 py-2 rounded-lg font-mono font-bold text-2xl">{params.id}</code> não está registrado no sistema.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black py-4 px-8 rounded-xl transition-all duration-300 text-xl transform hover:scale-105 shadow-lg"
            >
              ← Voltar para Busca
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-3 py-4 max-w-7xl relative z-10">
        {/* Professional Header with Logout - Mobile Optimized */}
        <div className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-2xl p-3 flex items-center justify-between animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-90">Profissional:</p>
              <p className="text-base md:text-xl font-black truncate max-w-[150px] md:max-w-none">{professionalName}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-1 border-2 border-white/30 text-sm"
          >
            <span className="text-lg">🚪</span> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

        {/* Header with Back Button - Mobile Optimized */}
        <div className="mb-4 flex items-center justify-between animate-slide-in">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white/90 backdrop-blur-lg hover:bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 border-2 border-gray-200 hover:border-blue-500 text-sm"
          >
            <span className="text-lg">←</span> <span className="hidden sm:inline">Finalizar</span>
          </button>
          <div className="bg-white/90 backdrop-blur-lg px-3 py-2 rounded-lg shadow-lg border-2 border-gray-200">
            <p className="text-xs font-semibold text-gray-600">
              🕐 {new Date(patient.lastUpdate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Emergency Alert - Mobile Optimized */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white rounded-xl shadow-2xl p-3 mb-3 text-center border-4 border-red-400/30 pulse-glow animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black flex items-center justify-center gap-2">
            <span className="text-xl md:text-3xl animate-pulse">🚨</span>
            ATENDIMENTO DE EMERGÊNCIA
            <span className="text-xl md:text-3xl animate-pulse">🚨</span>
          </h2>
        </div>

        {/* CRITICAL INFO - Simplified Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 mb-3 border-4 border-red-300 animate-fade-in">
          <div className="flex items-center gap-4">
            <img
              src={patient.personalInfo.photo}
              alt={patient.personalInfo.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-red-500 shadow-xl flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-1 break-words leading-tight">
                {patient.personalInfo.name}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm md:text-base">
                <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded font-bold">{patient.personalInfo.age} anos</span>
                <span className="bg-purple-100 text-purple-900 px-2 py-1 rounded font-bold">{patient.personalInfo.gender}</span>
                <span className="bg-red-100 text-red-900 px-3 py-1 rounded font-black text-lg md:text-xl">🩸 {patient.medicalInfo.bloodType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DADOS VITAIS CRÍTICOS */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-red-600 text-white p-3 rounded-lg text-center shadow-xl">
            <p className="text-xs font-bold mb-1">SANGUE</p>
            <p className="text-3xl md:text-4xl font-black">{patient.medicalInfo.bloodType}</p>
          </div>
          <div className="bg-blue-600 text-white p-3 rounded-lg text-center shadow-xl">
            <p className="text-xs font-bold mb-1">PESO</p>
            <p className="text-2xl md:text-3xl font-black">{patient.medicalInfo.weight}</p>
          </div>
          <div className="bg-purple-600 text-white p-3 rounded-lg text-center shadow-xl">
            <p className="text-xs font-bold mb-1">ALTURA</p>
            <p className="text-2xl md:text-3xl font-black">{patient.medicalInfo.height}</p>
          </div>
        </div>

        {/* Critical Observations - Mobile Optimized */}
        {patient.observations && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-500 rounded-xl shadow-2xl p-3 mb-3 animate-fade-in">
            <h2 className="text-base md:text-xl font-black text-yellow-900 mb-2 flex items-center gap-2">
              <span className="text-xl md:text-2xl animate-pulse">⚠️</span>
              ALERTA CRÍTICO
            </h2>
            <p className="text-sm md:text-lg text-gray-900 font-bold leading-relaxed bg-white/50 p-2 rounded-lg">{patient.observations}</p>
          </div>
        )}

        {/* Allergies - PRIORITY */}
        <div className="bg-red-50 rounded-xl shadow-xl p-3 mb-3 border-l-8 border-red-600 animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black text-red-700 mb-2 flex items-center gap-2">
            🚫 ALERGIAS
          </h2>
          {patient.allergies.length > 0 ? (
            <div className="space-y-2">
              {patient.allergies.map((allergy, index) => (
                <div key={index} className="bg-white border-l-4 border-red-600 p-3 rounded-lg shadow-md">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-black text-base md:text-xl text-red-900 mb-1">{allergy.name}</h3>
                      <p className="text-gray-700 text-xs md:text-sm">
                        <span className="font-bold">Reação:</span> {allergy.reaction}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded font-black text-xs md:text-sm whitespace-nowrap ${
                      allergy.severity === 'Alta' ? 'bg-red-600 text-white animate-pulse' :
                      allergy.severity === 'Média' ? 'bg-orange-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {allergy.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-2">Sem alergias conhecidas</p>
          )}
        </div>

        {/* Medications - PRIORITY */}
        <div className="bg-blue-50 rounded-xl shadow-xl p-3 mb-3 border-l-8 border-blue-600 animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black text-blue-700 mb-2 flex items-center gap-2">
            💊 MEDICAMENTOS EM USO
          </h2>
          {patient.medications.length > 0 ? (
            <div className="space-y-2">
              {patient.medications.map((med, index) => (
                <div key={index} className="bg-white border-l-4 border-blue-600 p-3 rounded-lg shadow-md">
                  <h3 className="font-black text-base md:text-xl text-blue-900 mb-2">{med.name}</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-bold text-blue-700 block">Dose</span>
                      <span className="text-gray-900">{med.dosage}</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-bold text-blue-700 block">Freq.</span>
                      <span className="text-gray-900">{med.frequency}</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-bold text-blue-700 block">Horário</span>
                      <span className="text-gray-900">{med.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-2">Sem medicação contínua</p>
          )}
        </div>

        {/* Medical Conditions - PRIORITY */}
        <div className="bg-purple-50 rounded-xl shadow-xl p-3 mb-3 border-l-8 border-purple-600 animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black text-purple-700 mb-2 flex items-center gap-2">
            🏥 CONDIÇÕES MÉDICAS
          </h2>
          {patient.conditions.length > 0 ? (
            <div className="space-y-2">
              {patient.conditions.map((condition, index) => (
                <div key={index} className="bg-white border-l-4 border-purple-600 p-3 rounded-lg shadow-md">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div className="flex-1 min-w-[150px]">
                      <h3 className="font-black text-base md:text-xl text-purple-900 mb-1">{condition.name}</h3>
                      <p className="text-gray-700 text-xs md:text-sm">
                        <span className="font-bold">Desde:</span> {condition.since}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded font-black text-xs md:text-sm whitespace-nowrap ${
                      condition.status === 'Controlada' ? 'bg-green-500 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {condition.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-2">Sem condições registradas</p>
          )}
        </div>

        {/* Emergency Contacts - PRIORITY */}
        <div className="bg-green-50 rounded-xl shadow-xl p-3 mb-3 border-l-8 border-green-600 animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black text-green-700 mb-2 flex items-center gap-2">
            📞 CONTATOS DE EMERGÊNCIA
          </h2>
          <div className="space-y-2">
            {patient.emergencyContacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact, index) => (
                <div key={index} className="bg-white border-l-4 border-green-600 p-3 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-base md:text-lg text-green-900">{contact.name}</h3>
                      <p className="text-gray-700 text-xs md:text-sm font-semibold">{contact.relationship}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-2 px-3 rounded-lg transition-all duration-200 text-sm md:text-base shadow-md flex items-center justify-center gap-2"
                  >
                    📱 {contact.phone}
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* Medical History - Collapsible */}
        <div className="bg-orange-50 rounded-xl shadow-xl p-3 mb-3 border-l-8 border-orange-600 animate-fade-in">
          <h2 className="text-lg md:text-2xl font-black text-orange-700 mb-2 flex items-center gap-2">
            📋 HISTÓRICO MÉDICO
          </h2>
          {patient.medicalHistory.length > 0 ? (
            <div className="space-y-2">
              {patient.medicalHistory.map((history, index) => (
                <div key={index} className="bg-white border-l-4 border-orange-600 p-3 rounded-lg shadow-md">
                  <h3 className="font-black text-base md:text-lg text-orange-900 mb-1 break-words">{history.description}</h3>
                  <p className="text-gray-700 text-xs md:text-sm font-semibold mb-1">
                    🏥 {history.hospital}
                  </p>
                  <span className="inline-block bg-orange-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                    📅 {new Date(history.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-2">Sem histórico registrado</p>
          )}
        </div>

        {/* Back Button - Simplified */}
        <div className="text-center animate-fade-in mt-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-3 px-8 rounded-lg transition-all duration-300 text-base md:text-lg shadow-xl transform hover:scale-105"
          >
            ← NOVA LEITURA
          </button>
        </div>
      </div>
    </div>
  );
}
