import { useNavigate } from "react-router";
import styles from "./SetReviewAddPage.module.css";
import useFetchSetInfo from "../../../customHooks/useFetchSetInfo";
import AddPanel from "./AddPanel/AddPanel";
import Set from "./Set/Set";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SetReviewAddPage() {

    const { sets, selectedSetID, setSelectedSetID, loading, error } = useFetchSetInfo(); 
    const navigate = useNavigate(); 

    const [selectedSet] = sets.filter(set => set.set_id === selectedSetID);

    function handleSetClick(setID) {
        setSelectedSetID(setID);
    }

    //Replace with user-friendly pages 
    if (error) { return <h1>Error!</h1>}; 
    if (loading) { return <h1>Loading!</h1>};

    const displaySets = sets.map(set => {
        return(
            <li key={set.set_id}>
                <Set handleSetClick={handleSetClick} setData={set}></Set>
            </li>);
    });

    function navBack() {
        navigate("/setreviews");
    }

    const currentImg = selectedSet.set_img;

    return (
            <div className={styles.pageWrapper}>
                <button className={styles.navButton} onClick={navBack}><ArrowBackIcon fontSize="large"/></button>
                <AddPanel currentImg={currentImg} selectedSetID={selectedSetID}/>
                <div className={styles.sideBar}>
                    <p>Available Sets:</p>
                    <ul className={styles.setWrapper}>
                        {displaySets}
                    </ul>
                </div>
            </div>
    );
}

export default SetReviewAddPage; 