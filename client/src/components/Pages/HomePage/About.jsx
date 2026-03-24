import styles from "./About.module.css"
import InfoSquare from "./InfoSquare";
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ImagePreview from "./ImagePreview";

function About() {

    return (
        <div id="about" className={styles.aboutWrapper}>
            <h1 className={styles.title}> </h1>

            <div className={styles.squareWrapper}>
                <InfoSquare title="Rate" caption="Assign card ratings and pick out notable cards!" icon={RateReviewIcon}/>
                <InfoSquare title="Share" caption="Compare your ratings and stats against other people in pods!" icon={PeopleAltIcon}/>
                <InfoSquare title="Review" caption="Strengthen your card evaluation skills by comparing your results against 17lands data!" icon={AssessmentIcon}/>
            </div>

            <div className={styles.aboutContentWrapper}>
                {/*<h2 className={styles.aboutCaption}>Rate cards with ease!</h2>*/}
                <ImagePreview source="./home/contested1.png"/>
                <ImagePreview source="./home/contested2.png" />
            </div>
        </div>
    )

}

export default About; 