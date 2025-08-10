import styles from "./ErrorPage.module.css";

function ErrorPage({error}) {

    let header; 
    let errorImg; 
    let errorMsg; 

    if (!error) {
        header = 'Unknown Error. Please try again.'
        errorImg = "/sphere.jpg"; 
        errorMsg = 'Sorry!'; 
    }

    switch (error.status) {
        case 403: 
            header = "403 Authorization Error";
            errorImg = "/sphere.jpg"; 
            errorMsg = "You are not authorized to access this resource."; 
            break;
        case 429:
            header = "You have attempted too many requests.";
            errorImg = "/sphere.jpg"; 
            errorMsg = "Please try again in 15 minutes."
            break;
        default: 
            header = 'Unknown Error. Please try again.';
            errorImg = "/sphere.jpg"; 
            errorMsg = 'Sorry!'; 
    }

    //const isForbidden = error.message.startsWith('(403)');
    console.log(error);

    return ( <>
         <div className={styles.forbiddenWrapper}>
            <h1>{header}</h1>
            <img className={styles.image} src={errorImg}></img>
            <p>{errorMsg}</p>
        </div>         
        </>
    )
}

export default ErrorPage;