import styles from "./UserSet.module.css"
import { Link, useParams } from "react-router";
import LockOutlineIcon from '@mui/icons-material/LockOutline';

function UserSet({userSetData}) {

    const { podId } = useParams(); 
    const {set_name, includes_bonus, user_set_id, user_set_img, username, lock_time} = userSetData;
    console.log(userSetData);

    return (
        <div className={styles.userSet}>
            <img src={user_set_img} className={styles.image}></img>
            <div>
                <h1>{set_name}</h1>
                <p><i>{username}</i></p>
                <p className={styles.lockTime}><LockOutlineIcon/>{lock_time}</p>
            </div>
            <div className={styles.buttons}>
                <Link to={`/pods/${podId}/setreviews/${user_set_id}/stats/view`} className={styles.link}>View Stats Page</Link>
                <Link to={`/pods/${podId}/setreviews/${user_set_id}/cards/view`} className={styles.link}>View Reviews</Link>
            </div>
        </div>
    );
}

export default UserSet;