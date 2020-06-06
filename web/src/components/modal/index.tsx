import React from 'react';


interface ModalProps {
    show: boolean
}

const Modal: React.FC<ModalProps> = (props) => {
    if(!props.show) {
        return <div></div>;
    }
    return(

        <h1>modal---------</h1>
    )
}

export default Modal;