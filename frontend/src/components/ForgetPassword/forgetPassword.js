import React, { Component } from "react";
import UsernameInput from './usernameInput';
import OtpInput from './otpInput';
import PasswordInput from './passwordInput';
import Api from "../../api/api";
import Loading from '../Loading/Loading'
import { store } from 'react-notifications-component';
import { withRouter } from 'react-router-dom'

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
            loading: false,
            tokenOTP: "",
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
                otpToken: res.data.otpToken,
                isDisplayUsernameInput: false,
                isDisplayOtpInput: true,
                isDisplayPasswordInput: false,
                loading: false,
            })
            console.log(res)
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Lỗi",
                    message: "Tài khoản không chính xác vui lòng kiểm tra lại",
                    type: "warning",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__slideInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                return
            }
            store.addNotification({
                title: "Hệ thống có lỗi",
                message: "Vui lòng liên hệ quản trị viên hoặc thử lại sau",
                type: "danger",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
        }
    }

    setOtp = async (otp) => {
        console.log(otp);
        this.setState({
            otp: otp,
            loading: true,
        });
        try {
            let res = await Api.checkOTP(this.state.otpToken, otp)
            console.log(res)
            this.setState({
                loading: false,
                accessToken: res.data.accessToken,
                isDisplayUsernameInput: false,
                isDisplayOtpInput: false,
                isDisplayPasswordInput: true,
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Lỗi",
                    message: "OTP không chính xác vui lòng kiểm tra lại",
                    type: "warning",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__slideInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                return
            }
            store.addNotification({
                title: "Hệ thống có lỗi",
                message: "Vui lòng liên hệ quản trị viên hoặc thử lại sau",
                type: "danger",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })

        }

    }

    setPassword = async (password1, password2) => {
        this.setState({
            password1: password1,
            password2: password2,
        });
        let isDigit = password1.replace(/[^0-9]/g, "").length > 0 ? 1 : 0;
        let isLetter = password1.replace(/[^a-zA-Z]/g, '').length > 0 ? 1 : 0;
        let isPunctuation = (password1.length - password1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").length) > 0 ? 1 : 0;
        if (password1.length < 8 || (isDigit + isLetter + isPunctuation < 2)) {
            store.addNotification({
                title: "Lỗi",
                message: "Mật khẩu không hợp lệ! Mật khẩu phải dài tối thiểu 8 kí tự và chứa 2 trong 3 loại chữ, số, kí tự đặc biệt!",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return
        }
        if (password1 !== password2) {
            store.addNotification({
                title: "Cảnh báo",
                message: "Mật khẩu nhập lại không giống",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return
        }
        this.setState({
            loading: true
        })

        try {
            let res = await Api.forgetPassword(this.state.accessToken, password1)
            console.log(res)
            store.addNotification({
                title: "Thành công",
                message: "Đổi mật khẩu thành công",
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.setState({
                loading: false,
                accessToken: res.data.accessToken,
                isDisplayUsernameInput: false,
                isDisplayOtpInput: false,
                isDisplayPasswordInput: false,
            })
            this.props.history.push('/login')
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            store.addNotification({
                title: "Hệ thống có lỗi",
                message: "Vui lòng liên hệ quản trị viên hoặc thử lại sau",
                type: "danger",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
        }
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

export default withRouter(ForgetPassword);
