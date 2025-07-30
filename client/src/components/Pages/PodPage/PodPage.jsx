import styles from "./PodPage.module.css"
import useFetchPodInfo from "../../../customHooks/useFetchPodInfo";
import PodWidgets from "./PodWidgets/PodWidgets";
import DisplayPod from "./DisplayPod/DisplayPod";

function PodPage() {

    const { pageDetails, setPageDetails, loading, error } = useFetchPodInfo();

    if (loading) { return <h1>Loading...</h1>}
    if (error) { return <h1>Error!</h1>}

    const displayPods = pageDetails.map(pod => <DisplayPod/>);

    return (
        <div className={styles.pageWrapper}>
            {displayPods}
            {<PodWidgets/>}
            <h1>Hi!</h1>
        </div>
    )
}

export default PodPage;