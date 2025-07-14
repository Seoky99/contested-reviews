import { __unsafe_useEmotionCache } from "@emotion/react";
import styles from "./TrophyModal.module.css";
import ModalSelect from "./ModalSelect";

export default function TrophyModal({ isOpen, onClose, trophies, setTrophies, reviewData }) {
  if (!isOpen) return null;

  const { review_id, card_name, image_normal } = reviewData;

  /* Three states of a trophy: 
        -assignedThis
        -assignedOther 
        -unassigned 
  */

  function handleTrophyClick(selectedId) {
    let trophyCopy = [...trophies]; 

    trophyCopy = trophyCopy.map(trophy => {

      if (selectedId === trophy.trophy_id) {
        if (trophy.review_id === review_id) {
          return {...trophy, review_id: null, image_normal: null, card_name: null}
        } else {
          return {...trophy, review_id, image_normal: image_normal, card_name: card_name}
        }
      } else {
        return trophy;
      }
    })
    setTrophies(trophyCopy);
  }


  const displayTrophies = trophies.map(trophy => {

    let displayStyle = ``;

    if (trophy.review_id === null) {
        displayStyle = `${styles.unassigned}`;
    } else if (trophy.review_id === review_id) {
        displayStyle = `${styles.assignedThis}`;
    } else {
        displayStyle = `${styles.assignedOther}`;
    }

    return (
        <ModalSelect key={trophy.trophy_id} displayStyle={displayStyle} trophy={trophy} handleTrophyClick={handleTrophyClick}></ModalSelect>
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