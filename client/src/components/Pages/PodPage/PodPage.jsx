import styles from './PodPage.module.css'
import useFetchPodUserSetInfo from "../../../customHooks/useFetchPodUserSetInfo";
import { useParams } from 'react-router';
import UserSet from './UserSet/UserSet';
import Spinner from '../../Spinner/Spinner';

function PodPage() {

    const { podId } = useParams();
    const { userSets, setUserSets, loading, error } = useFetchPodUserSetInfo(podId);

    if (loading) { return <Spinner spinnerSize={100}/>}
    if (error) { return <h1>Error!</h1> }

    const displayUserSets = userSets.map(userSet => {
        return <UserSet userSetData={userSet} key={userSet.user_set_id}/>
    })

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.userSetWrapper}>
                {displayUserSets}
                {displayUserSets.length === 0 && <h1>No Set Reviews Locked In... Yet!</h1>}
            </div>
        </div>
    )

}

export default PodPage; 