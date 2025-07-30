import styles from './PodPage.module.css'
import useFetchPodUserSetInfo from "../../../customHooks/useFetchPodUserSetInfo";
import { useParams } from 'react-router';
import UserSet from './UserSet/UserSet';

function PodPage() {

    const { podId } = useParams();
    const { userSets, setUserSets, loading, error } = useFetchPodUserSetInfo(podId);

    if (loading) { return <h1>Loading...</h1>}
    if (error) { return <h1>Error!</h1> }

    const displayUserSets = userSets.map(userSet => {
        return <UserSet userSetData={userSet} key={userSet.user_set_id}/>
    })

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.userSetWrapper}>
                {displayUserSets}
            </div>
        </div>
    )

}

export default PodPage; 