import { Link } from "react-router"; 
import styles from "./Navigation.module.css";
import LogoutButton from "./LogoutButton";
import SearchIcon from "@mui/icons-material/Search";
import useAuthStore from "../../customHooks/store/useAuthStore";

function Navigation() {

    const token = useAuthStore(state => state.accessToken);
    const loggedIn = !!token; 

    return (
        <nav className={styles.navBar}>
            <Link to="/" className={styles.homeButton}>
                <img src="/logo4.png" height="50" width="135"></img>
            </Link>
            <div className={styles.searchWrapper}>
                <input className={styles.searchBar} type="search" placeholder="Under Construction!"></input>
                <SearchIcon className={styles.search}/>
            </div>
            <Link to="/setreviews" className={styles.link}>My Set Reviews</Link>
            <Link className={styles.link}>Pods (Coming Soon!)</Link>
            { !loggedIn ? 
                <>
                    <Link to="/login" className={styles.login}>Login</Link>
                    <Link to="/register" className={styles.register}>Register</Link>
                </> :
                    <LogoutButton/>}
        </nav>
    )
}

export default Navigation;