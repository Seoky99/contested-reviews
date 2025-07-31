import axiosPrivate from "../../../customHooks/store/useAxiosPrivate"
import useAuthStore from "../../../customHooks/store/useAuthStore";
import styles from "./DeleteAccountButton.module.css";
import { useNavigate } from "react-router";

function DeleteAccountButton() {

    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();


    async function handleDelete() {

        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            return;
        }


        try {
            await axiosPrivate.delete("user");
            logout(); 
            navigate("/");
        } catch (err) {
            console.log(err);
            alert("Something went wrong while deleting your account.");
        }
    }

    return (
        <button className={styles.delete} onClick={handleDelete}>Delete Account</button>
    );
}

export default DeleteAccountButton;
