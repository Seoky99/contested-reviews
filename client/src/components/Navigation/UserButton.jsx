import { Link } from "react-router";
import styles from "./UserButton.module.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function UserButton() {
  return <Link to="/settings">Settings</Link>;
}

export default UserButton;