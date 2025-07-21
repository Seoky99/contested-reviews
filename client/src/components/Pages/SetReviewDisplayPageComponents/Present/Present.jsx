function Present({children, isOpen, setIsOpen}) {

    function openPresent(isOpen) {
        if (!isOpen) {
            setIsOpen(!isOpen);
        } 
    }

    return (
        <div onClick={() => openPresent(isOpen)}>
            { !isOpen && 
                <div>
                    {children}
                </div>
            }
            { isOpen && 
                <div>
                    {children}
                </div>
            }
        </div>
    );

}

export default Present; 