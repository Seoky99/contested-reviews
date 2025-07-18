import styles from "./ErrorFallbackPage.module.css";

function ErrorFallbackPage() {

    return (
        <div className={styles.errorWrapper}>
            <h1>Uh-oh! You shouldn't be here.</h1>
            <img className={styles.image} src="/crashnburn.jpg"></img>
            <p>Something went wrong...</p>
        </div>
    );

}

export default ErrorFallbackPage;