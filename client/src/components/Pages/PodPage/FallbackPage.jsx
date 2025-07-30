import styles from "./FallbackPage.module.css"

function FallbackPage() {

    return (
        <div className={styles.pageWrapper}>
            <img className={styles.image} src="/friendship.jpg"></img>
            <h1>Pick a pod!</h1>
        </div>
    )
}

export default FallbackPage;