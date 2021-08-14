import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import './ErrorModal.css';
import { CSSTransition } from 'react-transition-group';

const ErrorModalOverlay = props => {
  
  const content = (
    <div className="error-modal" >
    {props.children}                                          
    </div>
    );                                                                   
    return ReactDOM.createPortal(content, document.getElementById('full-modal-hook'));  
  };
  
  const ErrorModal = props => {
    return (
      <React.Fragment>
             <CSSTransition 
          in={props.show} 
          mountOnEnter 
          unmountOnExit 
          timeout={200} 
          classNames={"error-modal"}   
          >
            <ErrorModalOverlay {...props} />
          </CSSTransition>
      </React.Fragment>
    )
  }
  
  export default ErrorModal;