import { Link } from "react-router-dom";
import "../styles/components/footer.scss";

export default function Footer() {
    return (
        <footer className="site-footer">
            <nav aria-label="Informations légales">
                <Link to="/LegaleNotice">Mentions légales</Link>
                <Link to="/PrivacyPolicy">Confidentialité</Link>
                <Link to="/CGU">CGU</Link>
            </nav>
        </footer>
    );
}
