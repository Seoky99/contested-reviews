import styles from "./SideBar.module.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function SideBar({children, shrinkBar, editMode=false}) {

    return (
        <div className={`${styles.sideBar} ${editMode && `${styles.sideBarEdit}`}`}>
            <div className={styles.paddedContent}>
                {children}
            </div>
            <button className={styles.leftButton} onClick={shrinkBar}><ArrowBackIosIcon/></button>
        </div>
    );

}

export default SideBar; 