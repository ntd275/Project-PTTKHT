import React, { Component } from "react";
import UsernameInput from './OldPasswordInput';
import PasswordInput from './passwordInput';
import Loading from '../Loading/Loading'
import Api from "../../api/api";
import AppContext from '../../context/AppContext'
import { store } from 'react-notifications-component';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisplayOldPasswordInput: true,
            isDisplayPasswordInput: false,
            oldPassword: '',
            password1: '',
            password2: '',
            loading: false
        };
    }

    setOldPassword = async (oldPassword) => {
        console.log(oldPassword);
        this.setState({
            oldPassword: oldPassword,
            loading: true,
        });
        try {
            //console.log(this.context, oldPassword)
            await Api.checkPassword(this.context.user.accountId, oldPassword);
            this.setState({
                loading: false,
                isDisplayOldPasswordInput: false,
                isDisplayPasswordInput: true,
            })
        } catch (err) {
            console.log(err);
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Lỗi",
                    message: "Mật khẩu không chính xác vui lòng kiểm tra lại",
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
    setOtp = (otp) => {
        console.log(otp);
        this.setState({
            otp: otp
        });
    }
    setPassword = async (password1, password2) => {
        //console.log(password1, password2);
        if (password1 !== password2) {
            store.addNotification({
                title: "Lỗi",
                message: "Mật khẩu nhập lại không đúng",
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
            password1: password1,
            password2: password2,
            loading: true,
        });
    }
    render() {
        let { isDisplayOldPasswordInput,
            isDisplayPasswordInput } = this.state;
        return (
            <div className="container">
                <Loading show={this.state.loading} />
                { isDisplayOldPasswordInput ? <UsernameInput onReceiveOldPassword={this.setOldPassword} /> : ""}
                { isDisplayPasswordInput ? <PasswordInput onReceivePassword={this.setPassword} /> : ""}
            </div>
        );
    }
}

ChangePassword.contextType = AppContext

export default ChangePassword;
