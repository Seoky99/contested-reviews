import { __unsafe_useEmotionCache } from "@emotion/react";
import styles from "./TrophyModal.module.css";
import CardTrophy from "./CardTrophy";
import Card from "@mui/material/Card";

export default function TrophyModal({ isOpen, onClose, trophies, setTrophies, reviewId }) {
  if (!isOpen) return null;

  /* Three states of a trophy: 
        -assignedThis
        -assignedOther 
        -unassigned 
  */

  function handleTrophyClick(reviewId, trophyId) {
    let trophyCopy = [...trophies]; 

    trophyCopy = trophyCopy.map(trophy => {

      if (trophyId === trophy.trophy_id) {
        if (trophy.review_id === reviewId) {
          return {...trophy, review_id: null}
        } else {
          return {...trophy, review_id: reviewId}
        }
      } else {
        return trophy;
      }
    })
    console.log(trophyCopy);
    setTrophies(trophyCopy);
  }


  const displayTrophies = trophies.map(trophy => {

    let displayStyle = ``;

    if (trophy.review_id === null) {
        displayStyle = `${styles.unassigned}`;
    }
    else if (trophy.review_id === reviewId) {
        displayStyle = `${styles.assignedThis}`;
    } else {
        displayStyle = `${styles.assignedOther}`;
    }

    return (
        <div className={`${styles.trophy} ${displayStyle}`} key={trophy.trophy_id} onClick={() => handleTrophyClick(reviewId, trophy.trophy_id)}>
            <CardTrophy/>
            <h3>{trophy.name}</h3>
            <h4>{trophy.review_id}</h4>
        </div>
    );
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} 
      >
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <div className={styles.trophyWrapper}>
          {displayTrophies}
        </div>
      </div>
    </div>
  );
}