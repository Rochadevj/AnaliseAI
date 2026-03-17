import { useEffect, useState } from "react";
import logo from "../assets/12597368.png";

type Sessao = {
  id: string;
  name: string;
  status: string;
  metadata?: object;
  account?: string;
  createdAt?: string;
  updatedAt?: string;
};

function statusLabel(status: string) {
  if (status === "WORKING") return { text: "Conectado", color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200", emoji: "🟢" };
  if (status === "SCAN_QR_CODE") return { text: "Aguardando QR", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200", emoji: "🟡" };
  if (status === "FAILED") return { text: "Erro", color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200", emoji: "🔴" };
  if (status === "STOPPED") return { text: "Desconectado", color: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300", emoji: "⚪" };
  return { text: status, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300", emoji: "⚪" };
}

export default function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessoes() {
      try {
        const res = await fetch(`${import.meta.env.VITE_WAHA_BASE}/api/sessions`, {
          headers: { 'x-api-key': import.meta.env.VITE_WAHA_API_KEY || '' }
        });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : Object.values(data);
        setSessoes(arr);
      } catch (err) {
        setSessoes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSessoes();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="w-full h-20 sm:h-22 px-3 sm:px-5 flex items-center justify-center gap-2 sm:gap-3 bg-white dark:bg-black shadow-[0_0_6px_0_rgba(0,0,0,0.12)] dark:shadow-[0_0_6px_0_rgba(255,255,255,0.12)] fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 object-contain flex-shrink-0"
        />
        <h1 className="flex-1 text-black dark:text-white font-roboto text-sm sm:text-base md:text-lg lg:text-[28px] font-medium leading-tight sm:leading-9">
          WAHA Controle de Painel
        </h1>
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          <a href="/" className="text-black dark:text-white font-roboto text-sm lg:text-base hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Home
          </a>
          <a href="/sessoes" className="text-black dark:text-white border-b-2 border-black dark:border-white font-roboto text-sm lg:text-base transition-colors">
            Sessões
  </a>
          <a href="/configuracoes" className="text-black dark:text-white font-roboto text-sm lg:text-base hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Configurações
          </a>
        </nav>
        <div className="md:hidden">
          <button className="w-6 h-6 flex flex-col justify-center items-center">
            <span className="w-4 h-0.5 bg-black dark:bg-white mb-1"></span>
            <span className="w-4 h-0.5 bg-black dark:bg-white mb-1"></span>
            <span className="w-4 h-0.5 bg-black dark:bg-white"></span>
          </button>
        </div>
      </header>
      <main className="pt-24 sm:pt-20">
        <section className="flex flex-col py-8 sm:py-12 md:py-15 px-4 sm:px-6 md:px-10 lg:px-[170px] justify-center items-center gap-6 sm:gap-8 md:gap-10 w-full min-h-[400px]">
          <h2 className="text-black dark:text-white font-roboto text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold">
            Sessões
          </h2>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">Carregando sessões...</p>
          ) : sessoes.length === 0 ? (
            <p className="text-black dark:text-white font-roboto text-sm sm:text-base text-center px-4">
              Nenhuma sessão encontrada. Conecte seu WhatsApp pela Home.
            </p>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {sessoes.map(sessao => {
                const label = statusLabel(sessao.status);
                return (
                  <div
                    key={sessao.id || sessao.name}
                    className="p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col gap-3"
                  >
                    <div className="flex gap-2 items-center">
                      <span className="text-2xl sm:text-[28px]">{label.emoji}</span>
                      <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white">
                        {sessao.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Nº Conta: {sessao.account || "-"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sessao.createdAt && `Criada: ${new Date(sessao.createdAt).toLocaleString()}`}
                      {sessao.updatedAt && <><br/>Atualizada: {new Date(sessao.updatedAt).toLocaleString()}</>}
                    </p>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${label.color}`}
                    >
                      {label.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
