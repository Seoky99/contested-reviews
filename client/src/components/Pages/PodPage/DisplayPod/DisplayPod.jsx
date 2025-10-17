import styles from "./DisplayPod.module.css"
import PeopleIcon from '@mui/icons-material/People';
import {Link} from "react-router";

function DisplayPod({podData, selectPod, selectedPod}) {

    let selectedStyle; 

    if (selectedPod === podData.podId) {
        selectedStyle = styles.selectedStyle
    }

    return (
        <div className={styles.podWrapper}>
            <Link onClick={() => selectPod(podData.podId)} className={`${styles.podTitle} ${selectedStyle}`} to={`/pods/${podData.podId}/${podData.podCode}`}>
                <h1>{podData.podName}</h1>
                <p><PeopleIcon fontSize="large" className={styles.icon}/> {podData.members.length}</p>
            </Link>

        </div>
    )
}

export default DisplayPod; 