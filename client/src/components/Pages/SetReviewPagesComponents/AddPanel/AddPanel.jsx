import styles from "./AddPanel.module.css";
import SetReviewForm from "../SetReviewForm/SetReviewForm";
import { useNavigate } from "react-router";
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate";

function AddPanel({selectedSet, selectedSetID}) {

    const navigate = useNavigate(); 

    async function createSetReview(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form.entries());

        /*const url = `http://localhost:8080/api/setreviews`;      
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

            await response.json();   */
        try {

            const url = '/setreviews'; 
            const options = {headers: {"Content-Type": "application/json"}};

            await axiosPrivate.post(url, formData, options);

            navigate("/setreviews");
                        
        } catch (err) {
            throw new Error("Fetching error " + err);
        } 
    } 

    return (
    <div className={styles.addPanel}>
        <div className={styles.imageWrapper}>
            <img src={selectedSet.set_img} className={styles.image}></img>
        </div>
        <SetReviewForm selectedSetID={selectedSetID} name={selectedSet.name} createSetReview={createSetReview}/>
    </div>
    );
}

export default AddPanel; 