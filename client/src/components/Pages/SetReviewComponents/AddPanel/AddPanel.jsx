import styles from "./AddPanel.module.css";
import SetReviewForm from "../SetReviewForm/SetReviewForm";
import { useOutletContext, useNavigate } from "react-router";

function AddPanel() {

    const {setSetReviews, setReviews, currentImg, selectedSetID} = useOutletContext();
    const navigate = useNavigate(); 

    async function createSetReview(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form.entries());

        const url = `http://localhost:8080/api/setreviews`;      
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Server error" + response.status);
            }

            const data = await response.json();  
            setSetReviews([data, ...setReviews])

            navigate("../");
                        
        } catch (err) {
            throw new Error("Fetching error " + err);
        } 
    } 

    return (
    <div className={styles.addPanel}>
        <div className={styles.imageWrapper}>
            <img src={currentImg} className={styles.image}></img>
        </div>
        <SetReviewForm selectedSetID={selectedSetID} createSetReview={createSetReview}/>
    </div>
    );
}

export default AddPanel; 