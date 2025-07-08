import { useState } from "react";
import { useParams } from "react-router";
import Card from "../Card/Card";
import useFetchGallery from "../../customHooks/useFetchGallery";
import sortUtils from "../../utils/sortingUtils";
import styles from "./CardGalleryPage.module.css";

function CardGalleryPage() {
    const { userSetId } = useParams();
    const { reviews, setReviews, loading, error } = useFetchGallery(userSetId);
    const [selectedSort, setSelectedSort] = useState('None'); 

    if (error) {return <h1>error!</h1>}
    if (loading) { return <h1>Loading!</h1>}

    /*const bugFinding = reviews.filter(review => review.colors === null);
    console.log(bugFinding); */

    const displayReviews = reviews.map(review => {
        return <Card key={review.review_id} cardData={review} userSetId={userSetId}></Card>;
    })

    function sortCards(method) {
        const copy = [...reviews];
        
        switch(method) {
            case 'color':
                copy.sort((a, b) => sortUtils.sortingByColor(a, b));
                break;
            case 'cmc': 
                copy.sort((a, b) => sortUtils.sortingByCMC(a, b)); 
                break;
            default: 
                copy.sort((a, b) => sortUtils.sortingByColor(a, b));
        }
        setReviews(copy);
    }


    return (
        <>
            <div className={styles.mechanisms}>
                <div>
                    <label htmlFor="sorting">Sort: </label>
                    <select name="sorting" id="sorting" value={selectedSort} onChange={(e) => {
                        setSelectedSort(e.target.value); sortCards(e.target.value); }}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="filtering">Filter: </label>
                    <select name="fitering" id="filtering">
                        <option default value="none">None</option>
                        <option value="color">By Tag</option>
                    </select>
                </div>
            </div>

            <div className={styles.cardContainer}>{displayReviews}</div>
        </>
    );
}

export default CardGalleryPage;