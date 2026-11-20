import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function PageLayout() {
    return (
        <div className="app-layout">
            <div className="app-layout-content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
