import styles from "./Navigation.module.css";
import { Link } from "react-router"; 
import SearchIcon from "@mui/icons-material/Search";


function Navigation() {

     return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.homeButton}>
                <img src="/logo4.png" height="50" width="135"></img>
            </Link>
            <div className={styles.searchWrapper}>
                <input type="search" placeholder="Under Construction!"></input>
                <SearchIcon className={styles.search}/>
            </div>
            <Link to="/setreviews" className={styles.link}>My Set Reviews</Link>
            <Link className={styles.link}>Pods (Coming Soon!)</Link>
        </nav>
    )

}

export default Navigation;