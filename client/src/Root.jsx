import { Outlet } from "react-router"; 
import Navigation from "./components/Navigation/Navigation";
import styles from "./Root.module.css"; 

function Root() {
    return (
        <>
            <div className={styles.pageWrapper}>
                <Navigation></Navigation>
                <div className={styles.contentWrapper}>
                    <Outlet/>
                </div>
            </div>
        </>
    );
}

export default Root; 