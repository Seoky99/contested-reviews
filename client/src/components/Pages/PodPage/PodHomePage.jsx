import styles from "./PodHomePage.module.css"
import useFetchPodInfo from "../../../customHooks/useFetchPodInfo";
import PodWidgets from "./PodWidgets/PodWidgets";
import DisplayPod from "./DisplayPod/DisplayPod";
import { useState } from "react";
import { Outlet } from "react-router";

function PodPage() {

    const { pageDetails, setPageDetails, loading, error } = useFetchPodInfo();
    const [selectedPod, setSelectedPod] = useState(-1);

    if (loading) { return <h1>Loading...</h1>}
    if (error) { return <h1>Error!</h1>}

    function selectPod(podId) {
        setSelectedPod(podId);
    }

    const displayPods = pageDetails.map(pod => <DisplayPod key={pod.podId} podData={pod} selectedPod={selectedPod} selectPod={selectPod}/>);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.displayWrapper}>
                <h1 className={styles.title}>My Pods:</h1>
                {displayPods}
                {<PodWidgets/>}
            </div>
            <Outlet/>
        </div>
    )
}

export default PodPage;