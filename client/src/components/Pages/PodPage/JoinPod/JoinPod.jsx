import styles from "./JoinPod.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router"; 
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate.js";
import z from "zod"; 

function JoinPod() {

    const podSchema = z.object({
        podCode: z.string().trim().min(1, "Pod code cannot be empty").max(50)
                    .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
    });

    const {register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(podSchema)
    });

    const navigate = useNavigate(); 

    async function testPodCode(data) {
            const formData = data;

            try {
                const url = '/pods/join'; 
                const options = { headers: {"Content-Type": "application/json" }};
    
                await axiosPrivate.post(url, formData, options);

                navigate("/pods");          
            } catch (err) {
                console.log(err);

                if (err.response.data.message) {
                    setError("podCodeInvalid", {
                        type: "manual",
                        message: [err.response.data.message]
                    })
                } else {
                    throw new Error("Fetching error " + err);
                }
            } 
    } 

    return (
        <div className={styles.joinWrapper}>
            <form className={styles.podForm} onSubmit={handleSubmit(testPodCode)}>
                <div className={styles.formSeparator}>
                    <label htmlFor="podCode">Pod Code:</label>
                    <input {...register("podCode")} type="text" id="podCode" name="podCode" placeholder="Ex. ABCDEFG012"></input>
                </div>
                {errors.podCode && <p className={styles.errorStyle}>{errors.podCode.message}</p>}
                {errors.podCodeInvalid && <p className={styles.errorStyle}>{errors.podCodeInvalid.message}</p>}
                <button disabled={isSubmitting} className={styles.submitButton} type="submit">
                    {isSubmitting ?  `Creating...` : `Join Pod!`} 
                </button>
            </form>
        </div>
    );
}

export default JoinPod; 