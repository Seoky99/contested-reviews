import { Link, useLocation } from "react-router"; 
import styles from "./Navigation.module.css";
import SearchIcon from "@mui/icons-material/Search";
import useAuthStore from "../../customHooks/store/useAuthStore";
import UserButton from "./UserButton";

function Navigation() {

    const token = useAuthStore(state => state.accessToken);
    const loggedIn = !!token; 

    const location = useLocation();
    const path = location.pathname;

    let setReviewLink = path.startsWith("/setreviews") ? `${styles.link} ${styles.selected}` : `${styles.link}`; 
    let podLink = path.startsWith("/pods") ? `${styles.link} ${styles.selected}` : `${styles.link}`; 

    return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.homeButton}>
                <img src="/logo5.png" height="50" width="135"></img>
            </Link>
            <div className={styles.searchWrapper}>
                <input className={styles.searchBar} type="search" placeholder="Under Construction!"></input>
                <SearchIcon className={styles.search}/>
            </div>
            <Link to="/setreviews" className={setReviewLink}>My Set Reviews</Link>
            <Link to="/pods" className={podLink}>My Pods</Link>
            { !loggedIn ? 
                <>
                    <Link to="/login" className={styles.login}>Login</Link>
                    <Link to="/register" className={styles.register}>Register</Link>
                </> :
                    <UserButton/>}
        </nav>
    )
}

export default Navigation;