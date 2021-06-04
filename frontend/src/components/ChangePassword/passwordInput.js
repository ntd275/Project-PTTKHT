import React, { Component } from "react";
import { Link } from "react-router-dom";

class PasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password1: '',
            password2: ''
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    submitHandler = (e) => {
        let { password1, password2 } = this.state;
        e.preventDefault();
        this.props.onReceivePassword(password1, password2);
    }
    render() {
        return (
            <div className="container">
                <div className="row" style={{ marginTop: "40px" }} >
                    <div className="col-6" style={{ margin: "auto" }}>
                        <form action="/" onSubmit={e => this.submitHandler(e)}>
                            <div className="form-group">
                                <label >Mật khẩu mới:</label>
                                <input type="password" className="form-control"
                                    name="password1"
                                    onChange={e => this.changeHandler(e)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label >Nhập lại mật khẩu mới:</label>
                                <input type="password" className="form-control"
                                    name="password2"
                                    onChange={e => this.changeHandler(e)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Xác nhận</button>
                            <Link to="/" style={{ margin: "10px" }}>Bỏ qua</Link>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}

export default PasswordInput;
