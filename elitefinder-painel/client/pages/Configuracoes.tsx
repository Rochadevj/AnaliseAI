import React, { useState } from 'react';
import { Save, User, Palette, ClipboardList, ArrowLeft, LifeBuoy, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Configuracoes = ({ onBackToDashboard }: { onBackToDashboard: () => void }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  
  // Estados do formulário de suporte
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');


  const handleSave = () => {
    alert("Configurações salvas com sucesso!");
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus('idle');

    try {
      // Usando EmailJS para enviar email
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_mncksag', // Você precisará criar uma conta no EmailJS
          template_id: 'template_702lwms',
          user_id: '-qRusgbSTE_dClmQ6', // Chave pública do EmailJS
          template_params: {
            from_name: supportForm.name,
            from_email: supportForm.email,
            subject: supportForm.subject,
            message: supportForm.message,
            to_email: 'henriquerocha1357@gmail.com'
          }
        })
      });

      if (response.ok) {
        setSendStatus('success');
        setSupportForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSendStatus('idle'), 5000);
      } else {
        setSendStatus('error');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const mockCriteria = {
    saudacao: "Adequada",
    empatia: "Alta",
    tempo: "Rápido"
  };

  return (
    <div className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8 lg:px-16 xl:px-32 bg-gray-50 min-h-screen">
      <header className="mb-6 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none mb-1">Configurações</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gerencie as preferências da sua conta e da análise de IA.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/dashboard', { state: { fromSettings: true } })} 
            className="flex items-center justify-center px-4 sm:px-5 py-2 text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Voltar para o Dashboard</span>
            <span className="sm:hidden">Voltar</span>
          </button>
          <button onClick={handleSave} className="px-4 sm:px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {/* Coluna 1: Perfil + Aparência */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <User className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-400" /> Perfil do Usuário
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
                <input type="text" defaultValue="Admin Elite Finder" className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input type="email" defaultValue="admin@elitefinder.com" className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-100" disabled />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Palette className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-400" /> Aparência
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium text-gray-700">Modo Escuro</span>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className={`relative inline-flex h-6 sm:h-7 w-12 sm:w-14 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white transition-transform shadow ${theme === 'dark' ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <ClipboardList className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-400" /> Critérios da Análise IA
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
            Ajuste os critérios que a IA utiliza para pontuar as conversas. As alterações impactarão futuras análises.
          </p>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(mockCriteria).map(([key, value]) => (
              <div key={key} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 sm:p-4 border border-gray-100 rounded-xl bg-gray-50">
                <span className="text-sm sm:text-base font-medium text-gray-700 capitalize">{key}</span>
                <select defaultValue={value} className="w-full md:w-48 px-3 py-2 text-sm sm:text-base rounded-md border border-gray-200 bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200">
                  <option>Adequada</option>
                  <option>Ausente</option>
                  <option>Alta</option>
                  <option>Baixa</option>
                  <option>Moderada</option>
                  <option>Rápido</option>
                  <option>Lento</option>
                  <option>Razoável</option>
                </select>
              </div>
            ))}
            <div className="pt-4 sm:pt-6 border-t border-dashed border-gray-200">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Palavras-chave para Alertas (Negativo)</label>
              <input type="text" placeholder="Ex: problema, cancelar, péssimo, não resolveu" className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm sm:text-base bg-gray-50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Suporte Técnico */}
      <div className="mt-6 sm:mt-8 md:mt-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {/* Coluna 1: Informações do Suporte */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
            <div className="mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                <LifeBuoy className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Suporte Técnico
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Nossa equipe está pronta para ajudar com qualquer dúvida ou problema técnico.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white/60 backdrop-blur p-4 sm:p-5 rounded-xl border border-indigo-100">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                  Tempo de Resposta
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">
                  Até 24 horas úteis
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur p-4 sm:p-5 rounded-xl border border-indigo-100">
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                  Horário de Atendimento
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">
                  Seg - Sex: 9h às 18h
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2 e 3: Formulário de Contato */}
          <div className="xl:col-span-2 bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-400" /> Enviar Solicitação
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Preencha o formulário abaixo com suas informações e descreva sua dúvida ou problema.
            </p>

            {sendStatus === 'success' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="text-green-700 text-xs sm:text-sm">
                  <div className="font-semibold mb-1">Mensagem enviada com sucesso!</div>
                  <div className="text-green-600">Entraremos em contato em breve através do email informado.</div>
                </div>
              </div>
            )}

            {sendStatus === 'error' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✗</span>
                </div>
                <div className="text-red-700 text-xs sm:text-sm">
                  <div className="font-semibold mb-1">Erro ao enviar mensagem</div>
                  <div className="text-red-600">Tente novamente ou entre em contato diretamente: henriquerocha1357@gmail.com</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                    className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Email de Contato *</label>
                  <input
                    type="email"
                    required
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Assunto *</label>
                <input
                  type="text"
                  required
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Ex: Problema com sincronização, Dúvida sobre análise IA, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Descrição do Problema/Dúvida *</label>
                <textarea
                  required
                  rows={6}
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition"
                  placeholder="Descreva detalhadamente sua dúvida ou o problema encontrado. Quanto mais informações você fornecer, mais rápido poderemos ajudar."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                <p className="text-xs text-gray-500">
                  * Campos obrigatórios
                </p>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
