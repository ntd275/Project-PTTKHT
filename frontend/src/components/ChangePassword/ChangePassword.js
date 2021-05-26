import React, { Component } from "react";
import UsernameInput from './OldPasswordInput';
import PasswordInput from './passwordInput';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayOldPasswordInput: true,
            isDisplayPasswordInput: true,
            oldPassword: '',
            password1: '',
            password2: ''
        };
    }
    setOldPassword = (oldPassword) => {
        console.log(oldPassword);
        this.setState({
            oldPassword: oldPassword
        });
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
        let { isDisplayOldPasswordInput,
            isDisplayPasswordInput } = this.state;
        return (
            <div className="container">
                { isDisplayOldPasswordInput ? <UsernameInput onReceiveOldPassword={this.setOldPassword} /> : ""}
                { isDisplayPasswordInput ? <PasswordInput onReceivePassword={this.setPassword} /> : ""}
            </div>
        );
    }
}

export default ChangePassword;
