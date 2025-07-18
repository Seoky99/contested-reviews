import styles from "./ModifierButton.module.css";

function ModifierButton({handleClick, displayModifier, modifier}) {

    const addedStyle = modifier === displayModifier ? `${styles.selected}` : `${styles.notSelected}`;

    return (
            <button className={`${styles.modifierButton} ${addedStyle}`} onClick={handleClick}>
                {displayModifier}
            </button>);
}

export default ModifierButton; 