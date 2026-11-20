import { Link } from "react-router-dom";
import {
    ArrowLeft,
    HeartHandshake,
    TriangleAlert,
    PhoneCall,
} from "lucide-react";

import Navbar from "../components/Navbar";
import chaleur from "../assets/images/chaleur.webp";
import repos from "../assets/images/repos.webp";
import hydratation from "../assets/images/hydratation.webp";

import "../styles/pages/immediateHelp.scss";

export default function ImmediateHelp() {
    const country = localStorage.getItem("country")
    return (
        <>
            <Navbar />

            <main className="immediate-help-page">
                <Link to="/Home" className="immediate-help-back">
                    <ArrowLeft size={18} aria-hidden="true" />
                    Retour à l'accueil
                </Link>

                <header className="immediate-help-intro">
                    <HeartHandshake size={32} aria-hidden="true" />

                    <h1>Vous avez mal ? BADDIES est là pour vous aider.</h1>

                    <p>
                        Voici quelques gestes simples que vous pouvez essayer
                        pour soulager vos douleurs menstruelles.
                    </p>
                </header>

                <section className="immediate-help-tips" aria-labelledby="immediate-help-tips-title">
                    <h2 id="immediate-help-tips-title">
                        Ce que vous pouvez faire maintenant
                    </h2>

                    <article className="immediate-help-card">
                        <div className="immediateDiv">
                            <h3>Essayez la chaleur</h3>
                            <div className="card">
                                <img src={chaleur} alt="solution chaleur" />
                                <p>
                                    Posez une bouillotte tiède enveloppée dans un tissu
                                    sur le bas du ventre ou du dos.
                                    Ne la posez jamais directement sur la peau.
                                </p>
                            </div>

                        </div>
                    </article>

                    <article className="immediate-help-card">

                        <div className="immediateDiv">
                            <h3>Trouvez une position confortable</h3>
                            <div className="card">
                                <img src={repos} alt="solution repos" />
                                <p>
                                    Allongez-vous ou asseyez-vous dans une position
                                    agréable. Vous pouvez aussi marcher doucement
                                    si cela vous soulage.
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="immediate-help-card">
                        <div className="immediateDiv">
                            <h3>Prenez soin de vous</h3>
                            <div className="card">
                                <img src={hydratation} alt="solution hydratation" />
                                <p>
                                    Buvez selon votre soif, reposez-vous si vous en ressentez
                                    le besoin et prenez le temps de respirer calmement.
                                </p>
                            </div>

                        </div>
                    </article>
                </section>

                <section className="immediate-help-warning" aria-labelledby="immediate-help-warning-title">
                    <TriangleAlert size={28} aria-hidden="true" />

                    <h2 id="immediate-help-warning-title">
                        Quand demander de l'aide ?
                    </h2>

                    <p>
                        Si votre douleur est très forte, soudaine ou inhabituelle,
                        si vous faites un malaise, avez de la fièvre, vomissez beaucoup
                        ou présentez des saignements très abondants,
                        demandez rapidement une aide médicale.
                    </p>

                    {country === "France" ? (
                        <p>
                            En cas d'urgence médicale en France, appelez le 15 ou le 112.
                        </p>
                    ) : (
                        <p>
                            En cas d'urgence à Madagascar, contactez les services
                            d'urgence locaux ou rendez-vous au centre de santé le plus proche.
                        </p>
                    )}

                    <Link to="/emergencyContact" className="immediate-help-emergency">
                        <PhoneCall size={18} aria-hidden="true" />
                        Consulter les informations d'urgence
                    </Link>
                </section>

                <section className="immediate-help-support">
                    <h2>Vous n’avez pas à gérer cela toute seule</h2>

                    <p>
                        Vous pouvez en parler à un adulte de confiance,
                        à l'infirmière scolaire ou à un professionnel
                        de santé.
                    </p>
                </section>


            </main>
        </>
    );
}