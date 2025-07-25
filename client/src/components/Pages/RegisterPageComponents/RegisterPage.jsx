import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import styles from "./RegisterPage.module.css";
import axiosInstance from "../../../utils/axiosInstance";

function RegisterPage() {

    const navigate = useNavigate();

    const schema = z.object({
        username: z.string()
                   .min(3, {message: "Username must be at least 3 characters"})
                   .max(25, {message: "Username must be at most 25 characters"})
                   .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
        email: z.email(), 
        password: z.string()
                   .min(8, {message: "Password must be at least 8 characters"})
                   .max(25, {message: "Password must be at most 25 characters"}),
        confirmPassword: z.string()
    })
    .refine( (data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ['confirmPassword']
    });

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    }); 

    async function registerUser(data) {
        try {
            const response = await axiosInstance.post("/register", data);
            //TODO: implement redirection here!
            navigate("/login");
            console.log(response);

        } catch (err) {

            let field = "root";
            let message = "Something went wrong. Please try again.";
            let response = err.response; 

            if (response) {
                const data = response.data; 
                if (data) {
                    field = data.field || "root";
                    message = data.message || "Something went wrong. Please try again.";
                }
            } else {
                if (err.message === "Network Error") {
                    message = "Cannot connect to the server. Please try again later.";
                }
            }

            if (field === "all") {
                setError("username", { type: "server", message });
                setError("email", { type: "server", message });
                setError("password", { type: "server", message });
            } else if (field === "username" || field === "email" || field === "password") {
                setError(field, { type: "server", message });
            } else {
                setError("root", { type: "server", message });
            }
        }
    }
    
    return (
            <div className={styles.pageWrapper}>
                <div className={styles.cardOne}>
                    <img className={styles.cgb} src={"/cgb.png"}/>
                    <h1>S?</h1>
                </div>
                <form className={styles.form} onSubmit={handleSubmit(registerUser)}>

                    <h1>Create an Account</h1>
                    {errors.root && <p className={styles.error}>{errors.root.message}</p>}

                    <input {...register("username")} type="text" placeholder="Username"/>
                    {errors.username && <p className={styles.error}>{errors.username.message}</p>}
                    
                    <input {...register("email")} type="email" placeholder="Email"/>
                    {errors.email && <p className={styles.error}>{errors.email.message}</p>}

                    <input {...register("password")} type="password" placeholder="Password"/>
                    {errors.password && <p className={styles.error}>{errors.password.message}</p>}

                    <input {...register("confirmPassword")} type="password" placeholder="Confirm Password"/>
                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}

                    <button disabled={isSubmitting} className={styles.submit} type="submit">{isSubmitting ? 'Submitting...':'Submit'}</button>
                </form>
                <div className={styles.cardTwo}>
                    <img className={styles.doc} src={"/doc.png"}/>
                    <h1>B+?</h1>
                </div>
            </div>
        );

}

export default RegisterPage;