import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

class UsernameInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            username : '',
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name] : value });
    }
    submitHandler = (e) => {
        let { username } = this.state;
        e.preventDefault();
        this.props.onReceiveUsername(username);
    }
    render() {
        return (
            
            <div className="container">
                <div className="row" style={{ marginTop: "40px" }} >
                    <div className="col-6" style={{ margin: "auto" }}>
                        <form action="/" onSubmit={e => this.submitHandler(e)}>
                            <div className="form-group">
                                <label >Tên tài khoản:</label>
                                <input type="text" className="form-control" id="username" 
                                    name="username" 
                                    onChange={e => this.changeHandler(e)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Xác nhận</button>
                            <Link to="/login" style={{ margin: "10px" }}>Bỏ qua</Link>
                        </form>
                    </div>  
                </div>
            </div>
            
        );
    }
}

export default UsernameInput;
