import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

type Props = {
  onLogin: () => void;
};

const Login: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elite2025') {
      onLogin();
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 mx-auto mb-2 sm:mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Elite Finder</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Acesso ao Painel de Análise de Qualidade</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              placeholder="admin@elitefinder.com"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              defaultValue="admin@elitefinder.com"
              required
              disabled
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg shadow-indigo-200"
          >
            Entrar no Painel
          </button>
        </form>
        <p className="mt-4 sm:mt-6 text-center text-xs text-gray-400">Use 'elite2025' como senha para demonstração.</p>
      </div>
    </div>
  );
};

export default Login;
