import React, { Component } from "react";
import UsernameInput from './OldPasswordInput';
import PasswordInput from './passwordInput';
import Loading from '../Loading/Loading'
import Api from "../../api/api";
import AppContext from '../../context/AppContext'
import { store } from 'react-notifications-component';
import { withRouter } from 'react-router-dom'
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
        let isDigit = password1.replace(/[^0-9]/g,"").length > 0 ? 1 : 0;
        let isLetter = password1.replace(/[^a-zA-Z]/g, '').length > 0 ? 1 : 0;
        let isPunctuation = (password1.length - password1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").length) > 0 ? 1 : 0;
        if(password1.length < 8 || (isDigit+isLetter+isPunctuation < 2)){
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
        try {
            await Api.changePassword(this.context.user.accountId, this.state.oldPassword, password1)
            store.addNotification({
                title: "Thành công",
                message: `Đổi mật khẩu thành công`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.setState({ loading: false })
            this.props.history.push('/')

        } catch (err) {
            console.log(err)
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

export default withRouter(ChangePassword);
