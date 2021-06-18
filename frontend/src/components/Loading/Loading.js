import React from "react";
import { Modal } from "react-bootstrap"

class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <Modal show={this.props.show} backdrop="static">
                <Modal.Body >
                    <div className="d-flex justify-content-center text-primary">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal >
        )
    }
}

export default Loading