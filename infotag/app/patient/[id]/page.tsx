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

      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Professional Header with Logout */}
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <div>
              <p className="text-sm font-semibold opacity-90">Profissional:</p>
              <p className="text-xl font-black">{professionalName}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-white/30"
          >
            <span className="text-xl">🚪</span> Sair
          </button>
        </div>

        {/* Audit Alert */}
        <div className="mb-6 bg-yellow-100 border-4 border-yellow-500 rounded-2xl shadow-lg p-4 animate-fade-in">
          <div className="flex items-center gap-3 text-yellow-900">
            <span className="text-3xl">🔐</span>
            <div className="flex-1">
              <p className="font-bold text-lg">Acesso Auditado e Registrado</p>
              <p className="text-sm">
                Este acesso está sendo registrado para fins de auditoria e segurança. 
                Uso indevido será investigado.
              </p>
            </div>
          </div>
        </div>

        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between animate-slide-in">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white/90 backdrop-blur-lg hover:bg-white text-gray-800 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 border-2 border-gray-200 hover:border-blue-500 transform hover:scale-105"
          >
            <span className="text-xl">←</span> Finalizar Acesso
          </button>
          <div className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-600">
              🕐 Atualizado: {new Date(patient.lastUpdate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white rounded-2xl shadow-2xl p-6 mb-6 text-center border-4 border-red-400/30 pulse-glow animate-fade-in">
          <h2 className="text-3xl font-black flex items-center justify-center gap-3">
            <span className="text-4xl animate-pulse">🚨</span>
            INFORMAÇÕES DE EMERGÊNCIA
            <span className="text-4xl animate-pulse">🚨</span>
          </h2>
          <p className="text-lg font-semibold mt-2">Dados Médicos Vitais</p>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-white/50 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50"></div>
              <img
                src={patient.personalInfo.photo}
                alt={patient.personalInfo.name}
                className="relative w-40 h-40 rounded-full border-8 border-white shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {patient.personalInfo.name}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-1">Idade</p>
                  <p className="font-black text-3xl text-blue-900">{patient.personalInfo.age}</p>
                  <p className="text-xs text-blue-600">anos</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                  <p className="text-sm text-purple-700 font-semibold mb-1">Sexo</p>
                  <p className="font-black text-2xl text-purple-900">{patient.personalInfo.gender}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200 col-span-2 md:col-span-1">
                  <p className="text-sm text-red-700 font-semibold mb-1">Tipo Sanguíneo</p>
                  <p className="font-black text-5xl text-red-600">{patient.medicalInfo.bloodType}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-1">Doador</p>
                  <p className="font-black text-3xl">
                    {patient.medicalInfo.organDonor ? '✅' : '❌'}
                  </p>
                  <p className="text-xs text-green-600">{patient.medicalInfo.organDonor ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Observations */}
        {patient.observations && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-500 rounded-2xl shadow-2xl p-8 mb-6 animate-fade-in">
            <h2 className="text-3xl font-black text-yellow-900 mb-4 flex items-center gap-3">
              <span className="text-4xl animate-pulse">⚠️</span>
              OBSERVAÇÕES CRÍTICAS
            </h2>
            <p className="text-xl text-gray-800 font-bold leading-relaxed bg-white/50 p-4 rounded-xl">{patient.observations}</p>
          </div>
        )}

        {/* Allergies */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-red-200 animate-fade-in">
          <h2 className="text-3xl font-black text-red-600 mb-6 flex items-center gap-3">
            <span className="text-4xl">🚫</span> ALERGIAS
          </h2>
          {patient.allergies.length > 0 ? (
            <div className="grid gap-4">
              {patient.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-50 to-pink-50 border-l-8 border-red-600 p-6 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-black text-2xl text-red-800 mb-2">{allergy.name}</h3>
                      <p className="text-gray-700 text-lg">
                        <span className="font-semibold">Reação:</span> {allergy.reaction}
                      </p>
                    </div>
                    <span className={`px-5 py-2 rounded-full font-black text-lg shadow-md ${
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
            <p className="text-gray-600 text-lg text-center py-4">Nenhuma alergia registrada</p>
          )}
        </div>

        {/* Medications */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-blue-200 animate-fade-in">
          <h2 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3">
            <span className="text-4xl">💊</span> MEDICAMENTOS EM USO
          </h2>
          {patient.medications.length > 0 ? (
            <div className="grid gap-4">
              {patient.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-8 border-blue-600 p-6 rounded-xl shadow-lg"
                >
                  <h3 className="font-black text-2xl text-blue-800 mb-3">{med.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <span className="text-sm font-bold text-blue-700 block mb-1">Dosagem:</span>
                      <span className="text-gray-800 font-semibold text-lg">{med.dosage}</span>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <span className="text-sm font-bold text-blue-700 block mb-1">Frequência:</span>
                      <span className="text-gray-800 font-semibold text-lg">{med.frequency}</span>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <span className="text-sm font-bold text-blue-700 block mb-1">Horário:</span>
                      <span className="text-gray-800 font-semibold text-lg">{med.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg text-center py-4">Nenhum medicamento em uso</p>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-purple-200 animate-fade-in">
          <h2 className="text-3xl font-black text-purple-600 mb-6 flex items-center gap-3">
            <span className="text-4xl">🏥</span> CONDIÇÕES MÉDICAS
          </h2>
          {patient.conditions.length > 0 ? (
            <div className="grid gap-4">
              {patient.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-8 border-purple-600 p-6 rounded-xl shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-black text-2xl text-purple-800 mb-2">{condition.name}</h3>
                      <p className="text-gray-700 text-lg">
                        <span className="font-semibold">Desde:</span> {condition.since}
                      </p>
                    </div>
                    <span className={`px-5 py-2 rounded-full font-black text-lg shadow-md ${
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
            <p className="text-gray-600 text-lg text-center py-4">Nenhuma condição registrada</p>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-green-200 animate-fade-in">
          <h2 className="text-3xl font-black text-green-600 mb-6 flex items-center gap-3">
            <span className="text-4xl">📞</span> CONTATOS DE EMERGÊNCIA
          </h2>
          <div className="grid gap-4">
            {patient.emergencyContacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-8 border-green-600 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-xl shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-green-800">{contact.name}</h3>
                      <p className="text-gray-700 text-lg font-semibold">{contact.relationship}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-3 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg transform hover:scale-105 flex items-center gap-2"
                  >
                    📱 {contact.phone}
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-orange-200 animate-fade-in">
          <h2 className="text-3xl font-black text-orange-600 mb-6 flex items-center gap-3">
            <span className="text-4xl">📋</span> HISTÓRICO MÉDICO
          </h2>
          {patient.medicalHistory.length > 0 ? (
            <div className="grid gap-4">
              {patient.medicalHistory.map((history, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-8 border-orange-600 p-6 rounded-xl shadow-lg"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-black text-2xl text-orange-800 mb-2">{history.description}</h3>
                      <p className="text-gray-700 text-lg font-semibold">
                        🏥 {history.hospital}
                      </p>
                    </div>
                    <div className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-lg shadow-md">
                      📅 {new Date(history.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg text-center py-4">Nenhum histórico registrado</p>
          )}
        </div>

        {/* Physical Info */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border-4 border-gray-300 animate-fade-in">
          <h2 className="text-3xl font-black text-gray-700 mb-6 flex items-center gap-3">
            <span className="text-4xl">📏</span> INFORMAÇÕES FÍSICAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200 text-center">
              <p className="text-sm text-indigo-700 font-semibold mb-2">Altura</p>
              <p className="font-black text-4xl text-indigo-900">{patient.medicalInfo.height}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border-2 border-teal-200 text-center">
              <p className="text-sm text-teal-700 font-semibold mb-2">Peso</p>
              <p className="font-black text-4xl text-teal-900">{patient.medicalInfo.weight}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border-2 border-slate-200 text-center">
              <p className="text-sm text-slate-700 font-semibold mb-2">CPF</p>
              <p className="font-bold text-xl text-slate-900">{patient.personalInfo.cpf}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 animate-fade-in">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-5 px-12 rounded-2xl transition-all duration-300 text-xl shadow-2xl transform hover:scale-105"
          >
            ← Voltar para Página Inicial
          </button>
          <p className="mt-6 text-gray-600 font-semibold text-lg">
            💚 INFOTAG - Salvando vidas com tecnologia
          </p>
        </div>
      </div>
    </div>
  );
}
