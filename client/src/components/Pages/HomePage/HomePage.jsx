import styles from "./HomePage.module.css"
import CardFlow from "./CardFlow/CardFlow";
import { Link } from "react-router";

function HomePage() {

    return (
        <div className={styles.pageWrapper}>
            <CardFlow/>
            <div className={styles.center}>
                <div className={styles.text}>
                    <h1 className={styles.title}> <span className={styles.up}>Contested</span> <span className={styles.down}>Reviews</span></h1>
                    <p className={styles.beta}>BETA</p>
                </div>
                <div className={styles.linkWrapper}>
                    <Link className={`${styles.link} ${styles.homeButton}`} to="/setreviews">My Set Reviews</Link>
                    <Link className={`${styles.link} ${styles.homeButton}`}  to="/pods/">My Pods</Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage; 