import styles from "./HomePage.module.css"
import CardFlow from "./CardFlow/CardFlow";
import { Link } from "react-router";

function HomePage() { 

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.front}>
                <CardFlow/>
                <div className={styles.center}>
                    <div className={styles.text}>
                        <h1 className={styles.title}>Contested</h1>
                        <h1 className={styles.title}>Reviews</h1>
                    </div>
                    <div>
                        <p className={styles.caption}>The premier way to rate Magic: the Gathering cards!</p>
                    </div>
                    <div className={styles.linkWrapper}>
                        <Link className={`${styles.link} ${styles.homeButton}`} to="/setreviews">My Set Reviews</Link>
                        <Link className={`${styles.link} ${styles.homeButton}`}  to="/pods/">My Pods</Link>
                    </div>
                </div>
            </div>
            <div className={styles.linkDiv}>
                <Link className={styles.moreLink}>See More</Link>
            </div>
        </div>
    )
}

export default HomePage; 