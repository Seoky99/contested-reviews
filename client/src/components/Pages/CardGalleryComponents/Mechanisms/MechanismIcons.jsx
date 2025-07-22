import styles from "./MechanismIcons.module.css";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CloseIcon from '@mui/icons-material/Close';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { LuCrown } from "react-icons/lu";
import { GoNumber } from "react-icons/go";


function MechanismIcons({filter, sort, partition}) {

    const FILTER_ICON_MAP = {
        'none': <CloseIcon/>,
        'color': <ColorLensIcon sx={{color: 'red'}}/>
    };

    const PARTITION_ICON_MAP = {
        'none': <CloseIcon/>,
        'color': <ColorLensIcon/>,
        'cmc': <FormatListNumberedIcon/>,
        'rank': <TextIncreaseIcon/>,
        'rarity': <LuCrown/>
    }

    const SORT_ICON_MAP = {
        'none': <CloseIcon/>,
        'color': <ColorLensIcon/>,
        'cmc': <FormatListNumberedIcon/>,
        'rank': <TextIncreaseIcon/>,
        'rarity': <LuCrown/>,
        'cn': <GoNumber/>
    }

    return (
        <div className={styles.iconWrapper}>
            <p className={styles.icon}>{FILTER_ICON_MAP[filter]}</p>
            <p className={styles.icon}>{PARTITION_ICON_MAP[partition]}</p>
            <p className={styles.icon}>{SORT_ICON_MAP[sort]}</p>
        </div>
    )

}

export default MechanismIcons;