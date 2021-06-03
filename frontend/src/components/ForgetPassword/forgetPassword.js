import React, { Component } from "react";
import UsernameInput from './usernameInput';
import OtpInput from './otpInput';
import PasswordInput from './passwordInput';
import Api from "../../api/api";
import Loading from '../Loading/Loading'

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
            password2: '',
            loading: true,
        };
    }
    setUsername = async (username) => {
        //console.log(username);
        this.setState({
            username: username,
            loading: true,
        });
        try {
            let res = await Api.sendOTP(username)
            this.setState({
                isDisplayUsernameInput: false,
                isDisplayOtpInput: true,
                isDisplayPasswordInput: false,
                loading: false,
            })
        } catch (err) {
            console.log(err)
        }
    }
    setOtp = async (otp) => {
        console.log(otp);
        this.setState({
            otp: otp
        });
        try {
            let res = await Api.forgetPassword(this.state.username, otp)
        } catch (err) {

        }

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
                <Loading show={this.state.loading} />
                { isDisplayUsernameInput ? <UsernameInput onReceiveUsername={this.setUsername} /> : ""}
                { isDisplayOtpInput ? <OtpInput onReceiveOtp={this.setOtp} /> : ""}
                { isDisplayPasswordInput ? <PasswordInput onReceivePassword={this.setPassword} /> : ""}
            </div>
        );
    }
}

export default ForgetPassword;
