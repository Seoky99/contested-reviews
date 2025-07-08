import styles from "./Navigation.module.css";
import { Link } from "react-router"; 

function Navigation() {

     return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/setreviews" className={styles.link}>My Set Reviews</Link>
        </nav>
    )

}

export default Navigation;