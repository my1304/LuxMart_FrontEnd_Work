import React from 'react';
import ReactDOM from 'react-dom';
import ModalCustom from './ModalCustom';

const alertContainer = document.createElement('div');
document.body.appendChild(alertContainer);

const ModalOrder = (Parameter) => {
    const handleAlertClose = () => {
        ReactDOM.render(null, alertContainer); // Удаление компонента из DOM
    };

    ReactDOM.render(
           <ModalCustom Parameter={Parameter} onClose={handleAlertClose} />,
        alertContainer
    );
};

export default ModalOrder;