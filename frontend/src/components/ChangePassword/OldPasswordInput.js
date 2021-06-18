import React, { Component } from "react";
import { Link } from "react-router-dom";

class OldPasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    submitHandler = (e) => {
        let { oldPassword } = this.state;
        e.preventDefault();
        this.props.onReceiveOldPassword(oldPassword);
    }
    render() {
        return (

            <div className="container">
                <div className="row" style={{ marginTop: "40px" }} >
                    <div className="col-6" style={{ margin: "auto" }}>
                        <form action="/" onSubmit={e => this.submitHandler(e)}>
                            <div className="form-group">
                                <label >Nhập mật khẩu cũ:</label>
                                <input type="password" className="form-control" id="oldPassword"
                                    name="oldPassword"
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

export default OldPasswordInput;
