import { useState, useEffect } from "react"; 
import axiosPrivate from "../customHooks/store/useAxiosPrivate";

function useFetchSetReviewCardsEdit(userSetId) {

    const [reviewInfo, setReviewInfo] = useState([]);
    const [cards, setCards] = useState([]);

    const [initiallySelected, setInitiallySelected] = useState(new Set());
    const [selected, setSelected] = useState(new Set());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        async function fetchPageInfo() {

            const url = `setreviews/${userSetId}/cards/edit`;      

            try {
                const allCards = (await axiosPrivate.get(url)).data;

                setCards(allCards); 

                const initiallySelectedNew = new Set(); 
                const selectedNew = new Set(); 

                allCards.forEach(card => {
                    if (card.reviewId !== null) {
                        initiallySelectedNew.add(card.cardId); 
                        selectedNew.add(card.cardId);
                    }

                    setInitiallySelected(initiallySelectedNew);
                    setSelected(selectedNew);
                })


            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 
        fetchPageInfo(); 
    }, [userSetId]); 

    return {initiallySelected, setInitiallySelected, selected, setSelected, cards, loading, error};
}

export default useFetchSetReviewCardsEdit;