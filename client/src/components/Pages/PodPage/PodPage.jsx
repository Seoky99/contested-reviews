import styles from './PodPage.module.css'
import useFetchPodUserSetInfo from "../../../customHooks/useFetchPodUserSetInfo";
import { useParams, useNavigate, useOutletContext } from 'react-router';
import UserSet from './UserSet/UserSet';
import Spinner from '../../Spinner/Spinner';
import axiosPrivate from '../../../customHooks/store/useAxiosPrivate';

function PodPage() {

    const { podId, podCode } = useParams();
    const { userSets, setUserSets, loading, error } = useFetchPodUserSetInfo(podId);
    const [pageDetails, setPageDetails] = useOutletContext();
    const navigate = useNavigate(); 

    if (loading) { return <Spinner spinnerSize={100}/>}
    if (error) { return <h1>Error!</h1> }

    const displayUserSets = userSets.map(userSet => {
        return <UserSet userSetData={userSet} key={userSet.user_set_id}/>
    })

    function deleteFromPageDetails(podId) {
        let pageCopy = [...pageDetails];
        pageCopy = pageCopy.filter(pod => pod.podId != podId);
        setPageDetails(pageCopy);
        console.log("Page copy");
        console.log(pageCopy);
    }

    async function handleLeave() {
        try {
            await axiosPrivate.delete(`/pods/${podId}`);
            deleteFromPageDetails(podId);
            navigate('/pods');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.bannerWrapper}>
                <div>
                    <p className={styles.podCode}>Pod Code:</p>
                    <h1>{podCode}</h1>
                </div>
                {podId != 1 && <button className={styles.leaveButton} onClick={handleLeave}>Leave</button>}
            </div>
            <div className={styles.userSetWrapper}>
                {displayUserSets}
                {displayUserSets.length === 0 && <h2>No Set Reviews Locked In :/</h2>}
            </div>
        </div>
    )

}

export default PodPage; 