import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import Spinner from '../components/ui/Spinner';

/**
 * Rotas do site.
 *
 * ---------------------------------------------------------------------------
 * DIVISÃO DE CÓDIGO (code splitting)
 * ---------------------------------------------------------------------------
 * `lazy(() => import('...'))` diz ao Vite: gere um arquivo .js separado para
 * esta página e só baixe quando alguém entrar nela.
 *
 * Antes, todas as páginas iam num arquivo único. Quem abria a Home baixava
 * junto o painel administrativo, a biblioteca de planilhas e a árvore de
 * arquivos da transparência — sem nunca usar nada disso. Com o painel pronto,
 * a diferença ficou maior ainda: nenhuma das nove telas de administração pesa
 * um byte para quem só quer ler uma notícia.
 *
 * `<Suspense>` é o que o React mostra enquanto o pedaço está sendo baixado.
 *
 * ---------------------------------------------------------------------------
 * DUAS MOLDURAS
 * ---------------------------------------------------------------------------
 * `<Route element={<PublicLayout />}>` e `<Route element={<AdminLayout />}>`
 * são "rotas de layout": elas não têm caminho próprio, só envolvem as rotas
 * de dentro. É o que permite ao site ter navbar + rodapé e ao painel ter barra
 * inferior, sem um único `if` decidindo qual mostrar.
 *
 * ---------------------------------------------------------------------------
 * ENDEREÇOS ANTIGOS
 * ---------------------------------------------------------------------------
 * Os endereços mudaram, mas os antigos podem estar num e-mail ou nos favoritos
 * de alguém. Cada um ganhou um redirecionamento em vez de virar erro 404.
 */

/* ------------------------------------------------------------------ público */
const Home = lazy(() => import('../pages/Home'));
const WorkWithUs = lazy(() => import('../pages/WorkWithUs'));
const WorkWithUsDetail = lazy(() => import('../pages/WorkWithUs/Detail'));
const News = lazy(() => import('../pages/News'));
const NewsDetail = lazy(() => import('../pages/News/Detail'));
const Projects = lazy(() => import('../pages/Projects'));
const Contact = lazy(() => import('../pages/Contact'));
const Transparency = lazy(() => import('../pages/Transparency'));
const NotFound = lazy(() => import('../pages/NotFound'));

/* -------------------------------------------------------------------- admin */
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminRecruitmentList = lazy(() => import('../pages/admin/RecruitmentList'));
const AdminRecruitmentForm = lazy(() => import('../pages/admin/RecruitmentForm'));
const AdminNewsList = lazy(() => import('../pages/admin/NewsList'));
const AdminNewsForm = lazy(() => import('../pages/admin/NewsForm'));
const AdminMediaLibrary = lazy(() => import('../pages/admin/MediaLibrary'));
const AdminCandidates = lazy(() => import('../pages/admin/Candidates'));
const AdminContacts = lazy(() => import('../pages/admin/Contacts'));

/** Tela mostrada enquanto o arquivo da página está sendo baixado. */
function RouteFallback() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner label="Carregando a página" />
        </div>
    );
}

/**
 * As antigas páginas por área (`/projetos/esporte`) viraram âncoras dentro de
 * `/projetos`. `replace` troca a entrada no histórico em vez de empilhar outra,
 * para o botão "voltar" não devolver a pessoa ao endereço antigo num laço.
 */
function RedirectToAreaAnchor() {
    const { area } = useParams();
    return <Navigate to={`/projetos#${area}`} replace />;
}

function RedirectToJobDetail() {
    const { id } = useParams();
    return <Navigate to={`/trabalhe-conosco/${id}`} replace />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
                <Routes>
                    {/* ============================================ PÚBLICO === */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />

                        <Route path="/trabalhe-conosco" element={<WorkWithUs />} />
                        <Route path="/trabalhe-conosco/:id" element={<WorkWithUsDetail />} />

                        <Route path="/noticias" element={<News />} />
                        <Route path="/noticias/:id" element={<NewsDetail />} />

                        <Route path="/projetos" element={<Projects />} />
                        <Route path="/contato" element={<Contact />} />
                        <Route path="/transparencia" element={<Transparency />} />

                        {/* ------------- endereços antigos ------------- */}
                        <Route path="/projetos/:area" element={<RedirectToAreaAnchor />} />
                        <Route path="/processo-seletivo/:id" element={<RedirectToJobDetail />} />
                        <Route path="/area-restrita" element={<Navigate to="/admin" replace />} />
                        <Route path="/area-restrita/*" element={<Navigate to="/admin" replace />} />
                        {/* As páginas de transparência por município eram da v1 e
                            apontavam para endpoints que não existem no backend v2. */}
                        <Route path="/transparencia/*" element={<Navigate to="/transparencia" replace />} />

                        {/* "*" casa com qualquer coisa que não tenha casado antes,
                            então precisa ser a última do bloco. */}
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* ============================================== ADMIN === */}
                    {/* ⚠️ SEM PROTEÇÃO DE ROTA. É intencional nesta etapa: o
                        backend v2 ainda não tem autenticação, e esconder a tela
                        no front não protege nada — quem souber o endereço da API
                        chama direto. Precisa entrar antes de publicar. */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />

                        <Route path="processos-seletivos" element={<AdminRecruitmentList />} />
                        <Route path="processos-seletivos/novo" element={<AdminRecruitmentForm />} />
                        <Route path="processos-seletivos/:id" element={<AdminRecruitmentForm />} />

                        <Route path="noticias" element={<AdminNewsList />} />
                        <Route path="noticias/nova" element={<AdminNewsForm />} />
                        <Route path="noticias/:id" element={<AdminNewsForm />} />

                        <Route path="arquivos" element={<AdminMediaLibrary />} />

                        <Route path="candidatos" element={<AdminCandidates />} />
                        <Route path="contatos" element={<AdminContacts />} />

                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
