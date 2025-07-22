import styles from "./EditButton.module.css";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router";

function EditButton({userSetId, params}) {
    const hasQuestion = params.toString() !== '';
    const url = `/setreviews/${userSetId}/cards/edit${hasQuestion ? `?${params.toString()}` : ``}`;

    return (
        <Link className={styles.editLink} to={url}>
            <EditIcon/>
            Add/Remove Cards!
        </Link>
    );
}

export default EditButton;