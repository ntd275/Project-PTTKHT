import React, { Component } from "react";
import UsernameInput from './usernameInput';
import OtpInput from './otpInput';
import PasswordInput from './passwordInput';
import Api from "../../api/api";

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayUsernameInput: true,
            isDisplayOtpInput: false,
            isDisplayPasswordInput: false,
            username: '',
            otp: '',
            password1: '',
            password2: ''
        };
    }
    setUsername = async (username) => {
        //console.log(username);
        this.setState({
            username: username
        });
        try {
            let res = await Api.sendOTP(username)
        } catch (err) {
            console.log(err)
        }
    }
    setOtp = (otp) => {
        console.log(otp);
        this.setState({
            otp: otp
        });
    }
    setPassword = (password1, password2) => {
        console.log(password1, password2);
        this.setState({
            password1: password1,
            password2: password2
        });
    }
    render() {
        let { isDisplayUsernameInput,
            isDisplayOtpInput,
            isDisplayPasswordInput } = this.state;
        return (
            <div className="container">
                { isDisplayUsernameInput ? <UsernameInput onReceiveUsername={this.setUsername} /> : ""}
                { isDisplayOtpInput ? <OtpInput onReceiveOtp={this.setOtp} /> : ""}
                { isDisplayPasswordInput ? <PasswordInput onReceivePassword={this.setPassword} /> : ""}
            </div>
        );
    }
}

export default ForgetPassword;
