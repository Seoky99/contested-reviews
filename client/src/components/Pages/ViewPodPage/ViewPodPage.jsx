import { useParams, useLocation, useNavigate } from "react-router"; 
import { useState, useMemo } from "react";
import styles from "../CardGalleryComponents/CardGalleryPage.module.css";
import { applyMechanisms } from "../../../utils/applyMechanisms";
import useFetchPodViewPage from "../../../customHooks/useFetchPodViewPage";
import ViewCard from "./ViewCard";
import GalleryPartition from "../CardGalleryComponents/GalleryPartition.jsx/GalleryPartition";
import SideBar from "../CardGalleryComponents/SideBar/SideBar";
import MechanismIcons from "../CardGalleryComponents/Mechanisms/MechanismIcons";
import Mechanisms from "../CardGalleryComponents/Mechanisms/Mechanisms";
import IconBar from "../CardGalleryComponents/IconBar/IconBar";
import Spinner from "../../Spinner/Spinner";

function ViewPodPage() {

    let { userSetId, podId } = useParams();

    userSetId = Number(userSetId);

    let { cards, setCards, loading, error } = useFetchPodViewPage(podId, userSetId); 
    let location = useLocation(); 
    let navigate = useNavigate();
    const [sideBarActive, setSideBarActive] = useState(true);

    const params = new URLSearchParams(location.search); 
    const filter = params.has('filter') ? params.get('filter') : 'none';
    const sort = params.has('sort') ? params.get('sort') : 'none';
    const partition = params.has('partition') ? params.get('partition') : 'none';

    function setParams(mechanism, mechValue) {
        const params = new URLSearchParams(location.search);
        params.set(mechanism, mechValue);
        navigate(`?${params.toString()}`, { replace: true } );
    }

    const transformedReviews = useMemo(() => {
        if (!cards) {
            return null; 
        }
        return applyMechanisms(cards, filter, partition, sort);    
    }, [cards, filter, partition, sort]) 

    if (error) { return <h1>Error!</h1>}
    if (loading) { return <Spinner spinnerSize={100}/> }


    const renderChild = (review) => {
        return <ViewCard key={review.cardId} cardData={review}/>;
    }

    const displayReviews = transformedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} reviewArray={reviewArray} renderChild={renderChild}></GalleryPartition>
    });   

    return (
            <div className={styles.pageWrapper}>
                {sideBarActive ? <SideBar shrinkBar={() => setSideBarActive(!sideBarActive)} editMode={true}>
                                    <Mechanisms filter={filter} sort={sort} partition={partition} setParams={setParams}/>
                                </SideBar> : 
                                <IconBar expandBar={() => setSideBarActive(!sideBarActive)}>
                                    <MechanismIcons filter={filter} sort={sort} partition={partition}/>
                                 </IconBar> }
                <div className={styles.partitionContainer}>{displayReviews}</div>
            </div>
    );

}

export default ViewPodPage; 