import { useState, useMemo } from "react";
import { applyMechanisms } from "../../../utils/applyMechanisms.js";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useLocation } from "react-router";
import styles from "../CardGalleryComponents/CardGalleryPage.module.css";
import GalleryPartition from "../CardGalleryComponents/GalleryPartition.jsx/GalleryPartition.jsx";
import EditCard from "./EditCard.jsx";
import useFetchSetReviewCardsEdit from "../../../customHooks/useFetchSetReviewCardsEdit.js";
import Mechanisms from "../CardGalleryComponents/Mechanisms/Mechanisms.jsx";
import MechanismIcons from "../CardGalleryComponents/Mechanisms/MechanismIcons.jsx";
import SideBar from "../CardGalleryComponents/SideBar/SideBar.jsx";
import IconBar from "../CardGalleryComponents/IconBar/IconBar.jsx";
import axiosPrivate from "../../../customHooks/store/useAxiosPrivate.js";

function SetReviewEditCardsPage() {
    let { userSetId } = useParams();

    userSetId = Number(userSetId);

    let { cards, initiallySelected, setInitiallySelected, selected, setSelected, loading, error } = useFetchSetReviewCardsEdit(userSetId); 
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

    const queryClient = useQueryClient();

    const transformedReviews = useMemo(() => {
        if (!cards) {
            return null; 
        }
        return applyMechanisms(cards, filter, partition, sort);    
    }, [cards, filter, partition, sort]) 

    if (error) { return <h1>Error!</h1>}
    if (loading) { return <h1>Loading!</h1>}

    function toggleSelection(cardId) {
        const selectedCopy = new Set(selected);

        if (selectedCopy.has(cardId)) {
            selectedCopy.delete(cardId);
        } else {
            selectedCopy.add(cardId); 
        }

        setSelected(selectedCopy);
    }

    async function handleSaving() {
        const added = [...selected].filter(id => !initiallySelected.has(id));
        const removed = [...initiallySelected].filter(id => !selected.has(id));

        try {
            const url = `setreviews/${userSetId}/cards/edit`;
            await axiosPrivate.post(url, { added, removed }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            //before returning to card gallery, update changes made
            await queryClient.invalidateQueries(['cards', userSetId]);
            navigate(`/setreviews/${userSetId}/cards`);

        } catch (err) {
            console.log(err); 
        }
    }

    const renderChild = (review) => {
        return <EditCard key={review.cardId} cardData={review} selected={selected} toggleSelection={() => toggleSelection(review.cardId)}/>;
    }

    const displayReviews = transformedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} reviewArray={reviewArray} renderChild={renderChild}></GalleryPartition>
    });   

    return (

            <div className={styles.pageWrapper}>
                {sideBarActive ? <SideBar shrinkBar={() => setSideBarActive(!sideBarActive)} editMode={true}>
                                    <Mechanisms filter={filter} sort={sort} partition={partition} setParams={setParams}/>
                                    <button className={styles.saveButton} onClick={handleSaving}>SAVE CHANGES</button>
                                </SideBar> : 
                                <IconBar expandBar={() => setSideBarActive(!sideBarActive)}>
                                    <MechanismIcons filter={filter} sort={sort} partition={partition}/>
                                 </IconBar> }
                <div className={styles.partitionContainer}>{displayReviews}</div>
            </div>
    );
}

export default SetReviewEditCardsPage;