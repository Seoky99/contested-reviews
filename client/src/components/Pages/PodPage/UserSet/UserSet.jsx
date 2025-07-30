import styles from "./UserSet.module.css"

function UserSet({userSetData}) {

    const {set_name, includes_bonus, user_set_id, user_set_img, username} = userSetData;

    return (
        <div className={styles.userSet}>
            <img src={user_set_img} className={styles.image}></img>
            <div>
                <h1>{set_name}</h1>
                <p><i>{username}</i></p>
            </div>
            <div className={styles.buttons}>
                <button className={styles.link}>View Stats Page!</button>
                <button className={styles.link}>View Reviews!</button>
            </div>
        </div>
    );
}

export default UserSet;