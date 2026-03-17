import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeftCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-10 max-w-lg w-full flex flex-col items-center">
        <div className="mb-8 text-7xl">🚫</div>
        <h1 className="text-5xl font-black text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
        <p className="text-base text-gray-500 mb-8">
          Oops! A URL <span className="font-mono text-sm bg-gray-100 rounded px-2">{location.pathname}</span> não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
        >
          <ArrowLeftCircle className="w-5 h-5 mr-2" />
          Voltar para o Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
