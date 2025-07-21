import styles from "./Dropdown.module.css"

function Dropdown({children, header, isOpen, setIsOpen}) {

    return (
        <div className={styles.dropWrapper}>
            <div className={styles.dropHeader} onClick={() => setIsOpen(!isOpen)}>
                <h1>{header}</h1>
                <p>{ isOpen ? "▲" : "▼"}</p>
            </div>
            {isOpen && children}
        </div>
    );

}

export default Dropdown; 