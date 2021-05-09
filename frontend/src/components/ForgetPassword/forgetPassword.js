import React, { Component } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import UsernameInput from './usernameInput';
import OtpInput from './otpInput';
import PasswordInput from './passwordInput';

class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            isDisplayUsernameInput : true,
            isDisplayOtpInput : false,
            isDisplayPasswordInput : false,
            username : '',
            otp : '',
            password1 : '',
            password2 : ''
        };
    }
    setUsername = (username) => {
        console.log(username);
        this.setState({
            username : username
        });
    }
    setOtp = (otp) => {
        console.log(otp);
        this.setState({
            otp : otp
        });
    }
    setPassword = (password1, password2) => {
        console.log(password1, password2);
        this.setState({
            password1 : password1,
            password2 : password2
        });
    }
    render() {
        let { isDisplayUsernameInput,
            isDisplayOtpInput,
            isDisplayPasswordInput } = this.state;
        return (
            <Router>
                <div className="container">
                    { isDisplayUsernameInput ? <UsernameInput onReceiveUsername={ this.setUsername } /> : "" }
                    { isDisplayOtpInput ? <OtpInput onReceiveOtp={ this.setOtp } /> : "" }
                    { isDisplayPasswordInput ? <PasswordInput onReceivePassword={ this.setPassword }/> : "" }
                </div>
            </Router>
        );
    }
}

export default ForgetPassword;
