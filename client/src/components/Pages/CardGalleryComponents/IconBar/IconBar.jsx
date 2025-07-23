import styles from "./IconBar.module.css";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function IconBar({children, expandBar}) {

    return (
        <div className={styles.sideBarAlternate}>
            <div className={styles.moreContent}>
                {children}
            </div>
            <button className={styles.rightButton} onClick={expandBar}><ArrowForwardIosIcon/></button>
        </div>
    );

}

export default IconBar; 