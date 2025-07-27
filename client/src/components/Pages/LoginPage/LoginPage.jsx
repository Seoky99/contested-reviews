import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router";
import styles from "./LoginPage.module.css";
import useAuthStore from "../../../customHooks/store/useAuthStore";

function LoginPage() {

    const schema = z.object({
        username: z.string().min(1, {message: "Username is required"}),
        password: z.string().min(1, {message: "Password is required"}),
    });

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const login = useAuthStore(state => state.login);
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";

    async function loginUser(data) {
        try {
            await login(data);
            navigate(from, {replace: true});

        } catch (err) {
            const response = err.response; 

            if (response) {
                const data = response.data; 
                if (data) {
                    setError("root", { type: "server", message: data.message});
                }
            } else {
                if (err.message === "Network Error") {
                    setError("root", { type: "server", message: "Cannot connect to the server. Please try again later." });
                } else {
                    setError("root", { type: "server", message: "Unexpected error. Please try again.", });
                }
            }
        }
    } 

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.cardOne}>
                <img className={styles.cgb} src={"/cgb.png"}/>
                <h1>S?</h1>
            </div>
        <form className={styles.form} onSubmit={handleSubmit(loginUser)}>
            <h1>Login</h1>
            {errors.root && <p className={styles.error}>{errors.root.message}</p>}

            <input {...register("username")} type="text" placeholder="Username"/>
            {errors.username && <p className={styles.error}>{errors.username.message}</p>}

            <input {...register("password")} type="password" placeholder="Password"/>
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}

            <button disabled={isSubmitting} className={styles.submit} type="submit">{isSubmitting ? 'Submitting...':'Submit'}</button>
        </form>
            <div className={styles.cardTwo}>
                <img className={styles.doc} src={"/doc.png"}/>
                <h1>B+?</h1>
            </div>
        </div>
    )

}

export default LoginPage; 