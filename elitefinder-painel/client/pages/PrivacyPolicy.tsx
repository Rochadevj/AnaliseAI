import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/95 shadow-lg backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 bg-transparent border-none cursor-pointer transition-transform hover:scale-105 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xl font-bold">Soluções de Análise IA</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-lg shadow-lg transition hover:scale-105 border-none cursor-pointer"
          >
            Voltar ao Início
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.15)_0%,_rgba(79,70,229,0.02)_60%)]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-400 mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transparência total sobre como coletamos, usamos e protegemos seus dados.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Introduction */}
          <div className="mb-12 p-8 bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 rounded-2xl border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-7 h-7 text-indigo-400" />
              Introdução
            </h2>
            <p className="text-gray-300 leading-relaxed">
              A <strong className="text-white">Soluções de Análise IA</strong> está comprometida em proteger a privacidade e segurança dos dados dos nossos clientes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações obtidas através da nossa plataforma de análise de conversas do WhatsApp.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. Recomendamos que leia atentamente este documento.
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-7 h-7 text-cyan-400" />
              1. Dados Coletados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nossa plataforma coleta e processa os seguintes tipos de dados:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Mensagens do WhatsApp:</strong> Conteúdo das conversas entre sua equipe e clientes, incluindo texto, mídia e metadados (data, hora, remetente).</li>
              <li><strong className="text-white">Dados de Usuário:</strong> Nome, e-mail e informações de autenticação dos administradores e usuários da plataforma.</li>
              <li><strong className="text-white">Dados de Análise:</strong> Pontuações, sentimentos, métricas de desempenho e relatórios gerados pela IA.</li>
              <li><strong className="text-white">Logs Técnicos:</strong> Informações de acesso, endereços IP, navegador e sistema operacional para fins de segurança e melhoria do serviço.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-7 h-7 text-green-400" />
              2. Uso dos Dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Os dados coletados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Analisar a qualidade das conversas do WhatsApp através de inteligência artificial.</li>
              <li>Gerar pontuações, relatórios e insights sobre o desempenho da equipe de atendimento.</li>
              <li>Identificar tendências, sentimentos e oportunidades de melhoria no atendimento.</li>
              <li>Fornecer dashboards e visualizações de métricas em tempo real.</li>
              <li>Melhorar continuamente nossos algoritmos e serviços de análise.</li>
              <li>Garantir a segurança, integridade e funcionamento adequado da plataforma.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <strong className="text-yellow-400">Importante:</strong> Não compartilhamos, vendemos ou divulgamos seus dados a terceiros para fins comerciais ou publicitários.
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-7 h-7 text-red-400" />
              3. Segurança e Armazenamento
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Adotamos medidas rigorosas de segurança para proteger seus dados:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Criptografia:</strong> Todos os dados em trânsito são protegidos com criptografia TLS/SSL. Dados sensíveis em repouso são criptografados.</li>
              <li><strong className="text-white">Controle de Acesso:</strong> Acesso aos dados restrito apenas a usuários autorizados com autenticação segura.</li>
              <li><strong className="text-white">Infraestrutura Segura:</strong> Servidores hospedados em ambientes seguros, com monitoramento contínuo e backups regulares.</li>
              <li><strong className="text-white">Conformidade:</strong> Seguimos as melhores práticas de segurança da informação e estamos comprometidos com a LGPD (Lei Geral de Proteção de Dados).</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Os dados são armazenados em bancos de dados seguros pelo tempo necessário para fornecer os serviços contratados, exceto quando a retenção for exigida por lei.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <UserCheck className="w-7 h-7 text-purple-400" />
              4. Direitos do Usuário (LGPD)
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Acesso:</strong> Solicitar acesso aos seus dados pessoais que possuímos.</li>
              <li><strong className="text-white">Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong className="text-white">Exclusão:</strong> Solicitar a exclusão de dados pessoais, salvo quando a retenção for legalmente exigida.</li>
              <li><strong className="text-white">Portabilidade:</strong> Solicitar a portabilidade dos seus dados para outro fornecedor de serviço.</li>
              <li><strong className="text-white">Revogação:</strong> Revogar o consentimento para o tratamento de dados a qualquer momento.</li>
              <li><strong className="text-white">Oposição:</strong> Opor-se ao tratamento de dados em determinadas situações.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail: <a href="mailto:ia.tic.1055@gmail.com" className="text-indigo-400 hover:text-indigo-300 underline">ia.tic.1055@gmail.com</a>
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              5. Compartilhamento de Dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Seus dados podem ser compartilhados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Provedores de Serviços:</strong> Com parceiros técnicos que auxiliam na operação da plataforma (ex: hospedagem, processamento de IA), sob rígidos contratos de confidencialidade.</li>
              <li><strong className="text-white">Obrigações Legais:</strong> Quando exigido por lei, ordem judicial ou autoridades governamentais.</li>
              <li><strong className="text-white">Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança, bem como de nossos usuários e do público.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              <strong className="text-white">Nunca</strong> vendemos ou alugamos seus dados pessoais a terceiros para fins de marketing.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Cookies e Tecnologias de Rastreamento
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para melhorar a experiência do usuário, incluindo:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma (autenticação, sessão).</li>
              <li><strong className="text-white">Cookies de Desempenho:</strong> Para análise de uso e melhoria da performance.</li>
              <li><strong className="text-white">Cookies de Preferência:</strong> Para lembrar suas configurações e preferências.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Você pode gerenciar ou desabilitar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade da plataforma.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Alterações na Política
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou requisitos legais. Notificaremos você sobre alterações significativas por e-mail ou através de avisos na plataforma. A data da última atualização será sempre indicada no topo deste documento.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-10 p-8 bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 rounded-2xl border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Contato
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato conosco:
            </p>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-300"><strong className="text-white">E-mail:</strong> <a href="mailto:ia.tic.1055@gmail.com" className="text-indigo-400 hover:text-indigo-300 underline">ia.tic.1055@gmail.com</a></p>
              <p className="text-gray-300 mt-2"><strong className="text-white">Telefone:</strong> +55 (51) 99128-8418</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-lg hover:brightness-110 transition shadow-2xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs">&copy; {new Date().getFullYear()} Soluções de Análise IA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
