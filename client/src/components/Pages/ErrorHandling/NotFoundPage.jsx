import styles from "./NotFoundPage.module.css"; 

function NotFoundPage() {

    return (
        <div className={styles.notFoundWrapper}>
            <h1> 404 - Page Not Found</h1>
            <p> The page you're looking for doesn't exist.</p>
            <img className={styles.image} src="/totallylost.jpg"></img>
            <p>You're totally lost!</p>
        </div>
    );

}

export default NotFoundPage;