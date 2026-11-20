import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import logo from "../assets/images/logo-nav.webp";
import mascotte from "../assets/images/logoFinal-Photoroom.png";
import "../styles/pages/landing.scss";

export default function LandingPage() {
    return (
        <div className="landing-page">
            <div className="landing-shell">
            <header className="landing-header">
                <Link to="/" className="landing-brand" aria-label="BADDIES — Accueil">
                    <img src={logo} className="landing-brand-logo" alt="" width={60} height={60} />
                    <span className="landing-brand-name">BADDIES</span>
                </Link>
                <Link to="/Login" className="landing-login">Se connecter</Link>
            </header>

            <main className="landing-main">
                <section className="landing-hero" aria-labelledby="landing-title">
                    <div className="landing-stage">
                        <div className="landing-words" aria-hidden="true">
                            <span className="landing-wordmark">ÉCOUTER</span>
                            <span className="landing-wordmark">APAISER</span>
                            <span className="landing-wordmark">ACCOMPAGNER</span>
                            <span className="landing-wordmark">BADDIES</span>
                        </div>
                        {/* Le mouvement est séparé de la mise en page. */}
                        <div className="landing-mascot">
                            <img src={mascotte} alt="La mascotte rose de BADDIES" width={1254} height={1254} fetchPriority="high" />
                        </div>
                    </div>

                    <div className="landing-content">
                        <h1 id="landing-title">Des gestes simples pour mieux vivre <span>vos douleurs menstruelles.</span></h1>
                        <p>Découvrez des conseils adaptés à vos réponses, sans obligation de créer un compte.</p>
                        <div className="landing-actions">
                            <Link to="/Commencer" className="landing-button">Commencer <span aria-hidden="true">→</span></Link>
                            <Link to="/ImmediateHelp" className="landing-help">Voir les premiers gestes</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            </div>
        </div>
    );
}
