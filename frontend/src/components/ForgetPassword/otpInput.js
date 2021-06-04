import React, { Component } from "react";
import { Link } from "react-router-dom";

class OtpInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    submitHandler = (e) => {
        let { otp } = this.state;
        e.preventDefault();
        this.props.onReceiveOtp(otp);
    }
    render() {
        return (

            <div className="container">
                <div className="row" style={{ marginTop: "40px" }} >
                    <div className="col-6" style={{ margin: "auto" }}>
                        <form action="/" onSubmit={e => this.submitHandler(e)}>
                            <div className="form-group">
                                <div >
                                    Mã OTP đã được gửi vào email đăng ký tài khoản của bạn !
                                </div>
                                <label >Mã OTP:</label>
                                <input type="text" className="form-control" id="otp"
                                    name="otp"
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

export default OtpInput;
