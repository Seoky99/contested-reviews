import styles from "./ErrorPage.module.css";

function ErrorPage({error}) {

    let isForbidden = error.message.startsWith('(403)');

    return ( <>
         { isForbidden ? <div className={styles.forbiddenWrapper}>
                            <h1> 403 - Authorization Error </h1>
                            <img className={styles.image} src="/sphere.jpg"></img>
                            <p>{error.message}</p>
                        </div> :
                        <h1> Error! {error.message} </h1>
        }
        </>
    )
}

export default ErrorPage;