import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Users, Zap, Database } from 'lucide-react';

const TermsOfUse: React.FC = () => {
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 mb-6 shadow-2xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Direitos, responsabilidades e condições para uso da plataforma de análise de conversas.
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
          <div className="mb-12 p-8 bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 rounded-2xl border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-cyan-400" />
              Bem-vindo aos Nossos Termos de Uso
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma <strong className="text-white">Soluções de Análise IA</strong>, que oferece análise automatizada de conversas do WhatsApp através de inteligência artificial.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Ao acessar ou utilizar nossa plataforma, você concorda em cumprir e ficar vinculado a estes Termos. Se você não concordar com qualquer parte destes Termos, não utilize nossos serviços.
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-7 h-7 text-green-400" />
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Ao criar uma conta, fazer login ou utilizar qualquer funcionalidade da plataforma, você declara que:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Leu, compreendeu e concorda com estes Termos de Uso e nossa Política de Privacidade.</li>
              <li>Tem capacidade legal para celebrar contratos vinculativos.</li>
              <li>Representando uma empresa, possui autorização para vincular a empresa a estes Termos.</li>
              <li>Utilizará a plataforma de acordo com todas as leis e regulamentos aplicáveis.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              2. Descrição dos Serviços
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nossa plataforma oferece os seguintes serviços:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Análise de Conversas:</strong> Processamento automatizado de mensagens do WhatsApp para avaliação de qualidade de atendimento.</li>
              <li><strong className="text-white">Análise de Sentimento:</strong> Identificação automática de sentimentos (positivo, negativo, neutro) nas conversas.</li>
              <li><strong className="text-white">Pontuação por Critérios:</strong> Avaliação baseada em saudação, empatia, tempo de resposta e outros parâmetros configuráveis.</li>
              <li><strong className="text-white">Dashboards e Relatórios:</strong> Visualizações em tempo real de métricas, tendências e insights de desempenho da equipe.</li>
              <li><strong className="text-white">Exportação de Dados:</strong> Geração de relatórios detalhados em formatos compatíveis (CSV, PDF, etc.).</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Nos reservamos o direito de modificar, suspender ou descontinuar qualquer funcionalidade a qualquer momento, com ou sem aviso prévio.
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-7 h-7 text-blue-400" />
              3. Uso da Inteligência Artificial
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nossa plataforma utiliza algoritmos de inteligência artificial para analisar conversas. Você reconhece e concorda que:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Processamento Automatizado:</strong> As conversas são analisadas de forma automatizada pela IA, sem intervenção humana direta para cada análise.</li>
              <li><strong className="text-white">Precisão:</strong> Embora nos esforcemos para fornecer análises precisas, a IA pode não ser 100% exata em todos os casos. As pontuações e avaliações são indicativas e devem ser usadas como orientação, não como única fonte de decisão.</li>
              <li><strong className="text-white">Aprendizado Contínuo:</strong> Nossa IA é continuamente treinada e aprimorada com base em grandes volumes de dados, respeitando sempre a privacidade e confidencialidade dos dados dos usuários.</li>
              <li><strong className="text-white">Privacidade da IA:</strong> Os dados processados pela IA são utilizados exclusivamente para gerar insights para sua organização e melhorar nossos modelos. Não compartilhamos seus dados com terceiros para outros fins.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <strong className="text-blue-400">Compromisso de Privacidade:</strong> Todos os dados analisados pela IA são tratados com máxima confidencialidade e de acordo com nossa Política de Privacidade e a LGPD.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-7 h-7 text-purple-400" />
              4. Responsabilidades do Usuário
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Ao utilizar a plataforma, você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong className="text-white">Uso Lícito:</strong> Utilizar a plataforma apenas para fins legais e de acordo com estes Termos.</li>
              <li><strong className="text-white">Autenticação:</strong> Manter suas credenciais de acesso seguras e não compartilhá-las com terceiros não autorizados.</li>
              <li><strong className="text-white">Dados Precisos:</strong> Fornecer informações verdadeiras, precisas e atualizadas durante o cadastro e uso da plataforma.</li>
              <li><strong className="text-white">Consentimento:</strong> Garantir que possui consentimento adequado dos clientes/usuários cujas conversas serão analisadas, conforme exigido pela LGPD e outras leis aplicáveis.</li>
              <li><strong className="text-white">Não Compartilhamento Indevido:</strong> Não compartilhar, vender ou distribuir dados obtidos através da plataforma de forma não autorizada.</li>
              <li><strong className="text-white">Notificação de Violações:</strong> Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta ou violação de segurança.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-red-400" />
              5. Usos Proibidos
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Você <strong className="text-white">não</strong> deve utilizar a plataforma para:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Violar leis, regulamentos ou direitos de terceiros.</li>
              <li>Transmitir conteúdo ilegal, ofensivo, difamatório, obsceno, ou que viole direitos de propriedade intelectual.</li>
              <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte da plataforma.</li>
              <li>Utilizar bots, scripts ou mecanismos automatizados não autorizados para acessar ou manipular a plataforma.</li>
              <li>Interferir ou interromper o funcionamento da plataforma ou dos servidores.</li>
              <li>Coletar ou armazenar informações pessoais de outros usuários sem consentimento adequado.</li>
              <li>Utilizar a plataforma para fins fraudulentos, maliciosos ou prejudiciais a terceiros.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4 bg-red-900/20 border border-red-600/30 rounded-lg p-4">
              <strong className="text-red-400">Advertência:</strong> O descumprimento destas proibições pode resultar na suspensão ou cancelamento imediato da sua conta e possível responsabilização legal.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Todos os direitos de propriedade intelectual relacionados à plataforma, incluindo mas não limitado a:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Software, código-fonte, design, interface e funcionalidades.</li>
              <li>Logotipos, marcas, nomes comerciais e identidade visual.</li>
              <li>Algoritmos de IA, modelos de machine learning e metodologias de análise.</li>
              <li>Documentação, tutoriais e materiais de suporte.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              São de propriedade exclusiva da <strong className="text-white">Soluções de Análise IA</strong> ou de seus licenciadores. Nenhuma parte deste conteúdo pode ser copiada, reproduzida, distribuída ou modificada sem autorização prévia por escrito.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dentro dos limites permitidos pela lei aplicável:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>A plataforma é fornecida "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.</li>
              <li>Não garantimos que a plataforma será ininterrupta, livre de erros ou completamente segura.</li>
              <li>Não nos responsabilizamos por danos diretos, indiretos, incidentais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar a plataforma.</li>
              <li>Não somos responsáveis por decisões tomadas com base nas análises e insights fornecidos pela IA.</li>
              <li>Você é o único responsável por garantir backups adequados dos seus dados e por obter consentimento apropriado para análise de conversas.</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Privacidade e Proteção de Dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              A coleta, uso e proteção de dados pessoais são regidos por nossa <strong className="text-white">Política de Privacidade</strong>. Ao utilizar a plataforma, você concorda com as práticas descritas naquela política.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Estamos comprometidos com a <strong className="text-white">Lei Geral de Proteção de Dados (LGPD)</strong> e implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/privacidade')}
                className="text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Leia nossa Política de Privacidade completa →
              </button>
            </div>
          </div>

          {/* Section 9 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Suspensão e Cancelamento
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Reservamo-nos o direito de suspender ou cancelar sua conta e acesso à plataforma, a qualquer momento e sem aviso prévio, se:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Você violar qualquer disposição destes Termos de Uso.</li>
              <li>Houver suspeita de atividade fraudulenta, ilegal ou abusiva.</li>
              <li>Não efetuar pagamentos devidos (caso aplicável).</li>
              <li>Solicitarmos informações adicionais para verificação e você não fornecer.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Você pode cancelar sua conta a qualquer momento através das configurações da plataforma ou entrando em contato conosco. O cancelamento não isenta o pagamento de valores devidos até a data do cancelamento.
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Alterações nos Termos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos atualizar estes Termos de Uso periodicamente para refletir mudanças em nossos serviços, práticas ou requisitos legais. Notificaremos você sobre alterações significativas por e-mail ou através de avisos na plataforma. A continuidade do uso da plataforma após as alterações constitui aceitação dos novos Termos.
            </p>
          </div>

          {/* Section 11 */}
          <div className="mb-10 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Lei Aplicável e Jurisdição
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa decorrente ou relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais da comarca de São Paulo, SP, Brasil.
            </p>
          </div>

          {/* Section 12 */}
          <div className="mb-10 p-8 bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 rounded-2xl border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              12. Contato
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Se você tiver dúvidas, preocupações ou solicitações relacionadas a estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-300"><strong className="text-white">E-mail:</strong> <a href="mailto:ia.tic.1055@gmail.com" className="text-cyan-400 hover:text-cyan-300 underline">ia.tic.1055@gmail.com</a></p>
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

export default TermsOfUse;
