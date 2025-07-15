import { Outlet } from "react-router"; 
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import styles from "./Root.module.css"; 

function Root() {
    return (
        <>
            <div className={styles.pageWrapper}>
                <Navigation/>
                <div className={styles.contentWrapper}>
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default Root; 