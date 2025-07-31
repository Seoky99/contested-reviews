import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate.js";
import styles from "./SetReviewForm.module.css";
import z from "zod"; 

function SetReviewForm({selectedSetID, name}) {

    const setReviewSchema = z.object({
            setReviewName: z.string().trim().min(1, "Set review name cannot be empty").max(50)
                      .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
            setId: z.uuid(),
            defaultApplied: z.boolean().optional().default(false),
            bonusAdded: z.boolean().optional().default(false),
            makeShard: z.boolean().optional().default(false),
    });

    const {register, handleSubmit, setError, setValue, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(setReviewSchema)
    });

    useEffect(() => {
        if (selectedSetID) {
            setValue("setId", selectedSetID);
        }
    }, [selectedSetID, setValue]);

    const navigate = useNavigate(); 

    async function createSetReview(data) {
            const formData = data;

            try {
                const url = '/setreviews'; 
                const options = { headers: {"Content-Type": "application/json" }};
    
                await axiosPrivate.post(url, formData, options);
                navigate("/setreviews");
                            
            } catch (err) {
                console.log(err);
                throw new Error("Fetching error " + err);
            } 
    } 

    return (
        <form className={styles.setReviewForm} onSubmit={handleSubmit(createSetReview)}>
            <h4>Selected Set: {name}</h4>
            <input hidden readOnly {...register("setId")} name="setId" id="setId" type="text"></input>
            <div className={styles.formSeparator}>
                <label htmlFor="setReviewName">Name your set review:</label>
                <input {...register("setReviewName")} type="text" id="setReviewName" name="setReviewName"></input>
            </div>
            {errors.setReviewName && <p className={styles.errorStyle}>{errors.setReviewName.message}</p>}
            <div className={styles.formSeparator}>
                <label htmlFor="defaultApplied">Apply default ratings:</label>
                <input {...register("defaultApplied")} className={styles.checkBox} type="checkbox" id="defaultApplied" name="defaultApplied"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="bonusAdded">Include Bonus Sheet in Ratings:</label>
                <input {...register("bonusAdded")} className={styles.checkBox} type="checkbox" id="bonusAdded" name="bonusAdded"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="makeShard">Create a Shard! <i>(Start with zero cards)</i></label>
                <input {...register("makeShard")} className={styles.checkBox} type="checkbox" id="makeShard" name="makeShard"></input>
            </div>
            <button disabled={isSubmitting} className={styles.submitButton} type="submit">
                {isSubmitting ?  `Creating...` : `Create Set Review!`} 
            </button>
        </form>
    );
}

export default SetReviewForm;