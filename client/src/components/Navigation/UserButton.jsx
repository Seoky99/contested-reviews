import { Link } from "react-router";
import styles from "./UserButton.module.css";

function UserButton() {
  return <Link to="/settings" className={styles.user}>Settings</Link>;
}

export default UserButton;