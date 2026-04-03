import styles from "./HomePage.module.css"
import CardFlow from "./CardFlow/CardFlow";
import { Link } from "react-router";
import AboutSection from "./AboutSection/AboutSection"
import ImageSection from "./ImageSection/ImageSection"

function HomePage() { 

    return (
        <div>
            <div className={styles.pageWrapper}>
                <div className={styles.front}>
                    <div className={styles.remove}>
                        <CardFlow/>
                    </div>
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
                    <a href="#about" className={styles.moreLink}>See More</a>
                </div>
            </div>
            <AboutSection/>
            <ImageSection/>
        </div>
    )
}

export default HomePage; 