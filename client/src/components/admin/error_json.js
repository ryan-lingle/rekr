import React,{ useState } from "react";
import JSONPretty from 'react-json-pretty';
import { Modal } from "react-bootstrap";


const ErrorJson = (error) => {
  const [show, setShow] = useState(false);
  return(
    <div>
      <button className="btn btn-secondary" onClick={() => setShow(true)}>view json</button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ERROR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JSONPretty id="json-pretty" data={error}></JSONPretty>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ErrorJson;
