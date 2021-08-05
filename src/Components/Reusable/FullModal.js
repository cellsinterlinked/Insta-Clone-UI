import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import Backdrop from './Backdrop';
import './FullModal.css';

const FullModalOverlay = props => {
  
  const content = (
    <div className="full-modal" >
    {props.children}                                          
    </div>
    );                                                                   
    return ReactDOM.createPortal(content, document.getElementById('full-modal-hook'));  
  };
  
  const FullModal = props => {
    return (
      <React.Fragment>
            {props.show && <FullModalOverlay {...props} />}
      </React.Fragment>
    )
  }
  
  export default FullModal;