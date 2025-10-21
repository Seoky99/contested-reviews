import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useOutlet, useOutletContext } from "react-router";
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate.js";
import styles from "./CreatePodForm.module.css";
import z from "zod"; 

function CreatePodForm() {

    const podSchema = z.object({
        podName: z.string().trim().min(1, "Pod name cannot be empty").max(50)
                    .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
        isPrivate: z.boolean().optional().default(false),
    });

    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(podSchema)
    });

    const [pageDetails, setPageDetails] = useOutletContext(); 
    const navigate = useNavigate(); 

    function addPodToPageDetails(podData) {

        const pageCopy = [...pageDetails]; 
        const { podCode, podId, podName, username} = podData;

        pageCopy.push({members: [username], podCode, podId, podName});
        setPageDetails(pageCopy); 
    }

    async function createPod(data) {
            const formData = data;

            try {
                const url = '/pods'; 
                const options = { headers: {"Content-Type": "application/json" }};
    
                const podData = await axiosPrivate.post(url, formData, options);
                console.log(podData);
                addPodToPageDetails(podData.data);
                navigate("/pods");          
            } catch (err) {
                console.log(err);
                throw new Error("Fetching error " + err);
            } 
    } 

    return (
        <form className={styles.podForm} onSubmit={handleSubmit(createPod)}>
            <div className={styles.formSeparator}>
                <label htmlFor="podName">Pod Name:</label>
                <input {...register("podName")} type="text" id="podName" name="podName"></input>
            </div>
            {errors.podName && <p className={styles.errorStyle}>{errors.podName.message}</p>}
            <div className={styles.formSeparator}>
                <label htmlFor="isPrivate">Make Pod Private</label>
                <input {...register("isPrivate")} className={styles.checkBox} type="checkbox" id="isPrivate" name="isPrivate"></input>
            </div>
            <button disabled={isSubmitting} className={styles.submitButton} type="submit">
                {isSubmitting ?  `Creating...` : `Create Pod!`} 
            </button>
        </form>
    );
}

export default CreatePodForm;