import styles from "./SettingsPage.module.css";
import LogoutButton from "./LogoutButton.jsx";
import DeleteAccountButton from "./DeleteAccountButton.jsx";

function SettingsPage() {
    return (
        <div className={styles.settingsWrapper}>
            <h1>Settings</h1>
            <LogoutButton/>
            <DeleteAccountButton/>
        </div>
    )
}

export default SettingsPage;