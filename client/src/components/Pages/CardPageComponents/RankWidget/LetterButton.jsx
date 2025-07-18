import styles from "./LetterButton.module.css";

function LetterButton({handleClick, displayRank, base}) {

    const addedStyle = base === displayRank ? `${styles.selected}` : `${styles.notSelected}`;

    return (
            <button className={`${styles.letterButton} ${addedStyle}`} onClick={handleClick}>
                {displayRank}
            </button>);
}

export default LetterButton; 