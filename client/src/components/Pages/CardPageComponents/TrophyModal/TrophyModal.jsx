import styles from "./TrophyModal.module.css";

export default function TrophyModal({ isOpen, onClose, trophies, setTrophies }) {
  if (!isOpen) return null;

  /* Three states of a trophy: 
        -assignedThis
        -assignedOther 
        -unassigned 
  */
  console.log(trophies);

  const displayTrophies = trophies.map(trophy => {
    return (
        <div className={styles.trophy} key={trophy.trophy_id}>
            <img src={trophy.trophy_img_url} height="80" width="80"></img>
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