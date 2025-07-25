import { useNavigate } from "react-router";
import useAuthStore from "../../customHooks/store/useAuthStore";
import styles from "./LogoutButton.module.css";

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); 
  };

  return <button className={styles.logout} onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;