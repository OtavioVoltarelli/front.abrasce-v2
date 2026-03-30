import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import News from "../pages/News";
import Projects from "../pages/Projects";
import Transparency from "../pages/Transparency";
import WorkWithUs from "../pages/WorkWithUs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CompleteNew from "../pages/CompleteNews";
import CasaBranca from "../pages/Cities/CasaBranca";
import CasaBrancaRi from "../pages/Cities/CasaBranca/Projects/CasaBranca-RI";
import CasaBrancaPAIE from "../pages/Cities/CasaBranca/Projects/CasaBranca-PAIE";
import CasaBrancaCESE from "../pages/Cities/CasaBranca/Projects/CasaBranca-CESE";
import FMorato from "../pages/Cities/FMorato";
import FestaDoQuitute from "../pages/Cities/Jaboticabal/Projects/FestaDoQuitute";
import EscolaDaArte from "../pages/Cities/Jaboticabal/Projects/EscolaDaArte";
import JabotiFolia from "../pages/Cities/Jaboticabal/Projects/JabotiFolia";
import Jaboticabal from "../pages/Cities/Jaboticabal";
import Guaruja from "../pages/Cities/Guaruja";
import AssistenciaSocial from "../pages/Cities/Guaruja/Projects/AssistenciaSocial";
import Pereque from "../pages/Cities/Guaruja/Projects/Pereque";
import VilaJulia from "../pages/Cities/Guaruja/Projects/VilaJulia";
import SaoVicente from "../pages/Cities/SaoVicente";
import SedeAbrace from "../pages/Cities/SedeAbrasce";
import Tuiuti from "../pages/Cities/Tuiuti";
import RestrictedArea from "../pages/RestrictedArea";
import RecruitmentProcess from "../pages/RecruitmentProcess";
import Candidates from "../pages/Candidates";
import ContactManagement from "../pages/Contact-Management";
import NewsManagement from "../pages/News-Management";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import SportsProjects from "../components/All-Projects/Sport-Projects";
import EducationalProjects from "../components/All-Projects/Educational-Projects";
import CulturalProjects from "../components/All-Projects/Cultural-Projects copy";
import SocialAssistence from "../components/All-Projects/SocialAssistence-Projects";
import LeisureProjects from "../components/All-Projects/Leisure-Projects";

function AppRoutes() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/noticias" element={<News />} />
                <Route path="/projetos" element={<Projects />} />
                <Route path="/projetos/esporte" element={<SportsProjects />} />
                <Route path="/projetos/educacao" element={<EducationalProjects />} />
                <Route path="/projetos/cultura" element={<CulturalProjects />} />
                <Route path="/projetos/assistencia-social" element={<SocialAssistence />} />
                <Route path="/projetos/lazer" element={<LeisureProjects />} />
                <Route path="/transparencia" element={<Transparency />} />
                <Route path="/trabalhe-conosco" element={<WorkWithUs />} />
                <Route path="/noticias/:title" element={<CompleteNew />} />
                <Route path="/transparencia/casa-branca" element={<CasaBranca />} />
                <Route path="/transparencia/casa-branca-ri" element={<CasaBrancaRi />} />
                <Route path="/transparencia/casa-branca-cese" element={<CasaBrancaCESE />} />
                <Route path="/transparencia/casa-branca-paie" element={<CasaBrancaPAIE />} />
                <Route path="/transparencia/francisco-morato" element={<FMorato />} />
                <Route path="/transparencia/jaboticabal" element={<Jaboticabal />} />
                <Route path="/transparencia/jaboticabal/escola-da-arte" element={<EscolaDaArte />} />
                <Route path="/transparencia/jaboticabal/festa-do-quitute" element={<FestaDoQuitute />} />
                <Route path="/transparencia/jaboticabal/jabotifolia" element={<JabotiFolia />} />
                <Route path="/transparencia/guaruja" element={<Guaruja />} />
                <Route path="/transparencia/guaruja/vila-julia" element={<VilaJulia />} />
                <Route path="/transparencia/guaruja/pereque" element={<Pereque />} />
                <Route path="/transparencia/guaruja/assistencia-social" element={<AssistenciaSocial />} />
                <Route path="/transparencia/sao-vicente" element={<SaoVicente />} />
                <Route path="/transparencia/sede-abrasce" element={<SedeAbrace />} />
                <Route path="/transparencia/tuiuti" element={<Tuiuti />} />
                <Route path="/area-restrita" element={<PrivateRoute><RestrictedArea /></PrivateRoute>} />
                <Route path="/area-restrita/processos-seletivos" element={<PrivateRoute><RecruitmentProcess /></PrivateRoute>} />
                <Route path="/area-restrita/candidatos" element={<PrivateRoute><Candidates /></PrivateRoute>} />
                <Route path="/area-restrita/contatos" element={<PrivateRoute><ContactManagement /></PrivateRoute>} />
                <Route path="/area-restrita/noticias" element={<PrivateRoute><NewsManagement /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default AppRoutes;