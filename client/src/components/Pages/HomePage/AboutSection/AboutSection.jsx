import styles from "./AboutSection.module.css"
import InfoSquare from "../InfoSquare";
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';

function AboutSection() {
    return (
        <div id="about" className={styles.aboutWrapper}>
            <div className={styles.squareWrapper}>
                <InfoSquare title="Rate" caption="Assign card ratings and pick out notable cards!" icon={RateReviewIcon}/>
                <InfoSquare title="Share" caption="Compare your ratings and stats against other people in pods!" icon={PeopleAltIcon}/>
                <InfoSquare title="Review" caption="Strengthen your card evaluation skills by comparing your results against 17lands data!" icon={AssessmentIcon}/>
            </div>
        </div>
    )
}

export default AboutSection; 