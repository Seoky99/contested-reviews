import styles from "./Set.module.css";

function Set({handleSetClick, setData}) {

    let { set_id, set_code, set_img } = setData; 
    set_code = set_code.toUpperCase(); 

    return (
        <button className={styles.set} style={{backgroundImage: `url(${set_img})`}} onClick={() => handleSetClick(set_id)}>
            {set_code.toUpperCase()}
        </button>
    );

}

export default Set;