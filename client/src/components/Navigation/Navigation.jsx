import styles from "./Navigation.module.css";
import { Link } from "react-router"; 
import SearchIcon from "@mui/icons-material/Search";

function Navigation() {

     return (
        <nav className={styles.navBar}>
            <div>
                <input type="search">
                </input>
                <SearchIcon className={styles.search}/>
            </div>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/setreviews" className={styles.link}>My Set Reviews</Link>
            <Link className={styles.link}>Pods (Coming Soon!)</Link>
        </nav>
    )

}

export default Navigation;