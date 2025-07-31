import { Outlet } from "react-router"; 
import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router"; 
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import styles from "./Root.module.css"; 
import ErrorFallbackPage from "./components/Pages/ErrorHandling/ErrorFallbackPage";

function Root() {
    const location = useLocation();

    return (
        <div className={styles.rootWrapper}>
            <div className={styles.viewWrapper}>
                <Navigation/>
                <div className={styles.contentWrapper}>
                    <ErrorBoundary fallback={<ErrorFallbackPage/>} resetKeys={[location.pathname]}>
                        <Outlet/>
                    </ErrorBoundary>
                </div>
            </div>
        <Footer/>
        </div> 
    );
}

export default Root; 