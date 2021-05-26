import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Api from "../../api/api";
import AppContext from '../../context/AppContext'
import jwt from 'jwt-decode'
import Loading from '../Loading/Loading'
import { store } from 'react-notifications-component';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            loading: false,
        };
    }

    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let formData = this.state.formData;
        formData[name] = value;
        this.setState({ 'formData': formData });
    }

    submitHandler = async (e) => {
        let data = this.state.formData;
        e.preventDefault();
        //console.log(data);

        try {
            this.setState({ loading: true });
            let res = await Api.login(data.username, data.password)
            //console.log(res.data.accessToken)
            localStorage.setItem("accessToken", res.data.accessToken)
            let user = jwt(res.data.accessToken)
            //console.log(user)
            this.context.setUser(user)
            //Notification
            store.addNotification({
                title: "Đăng nhập thành công",
                message: `Xin chào ${user.accountName}`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 3000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            //redirect
            //console.log(this.props.location)
            let from = this.props.location.state && this.props.location.state.from
            this.setState({ loading: false })
            this.props.history.push(from || '/')
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 401) {
                store.addNotification({
                    title: "Đăng nhập thất bại",
                    message: "Tài khoản hoặc mật khẩu không chính xác",
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

    render() {
        return (
            <div className="container">
                <Loading show={this.state.loading} />
                <div className="row" style={{ marginTop: "40px" }}>
                    <div className="col-12 text-center">
                        <h1>Hệ thống sổ liên lạc điện tử</h1>
                        <h1>Trường Trung học cơ sở ABC</h1>
                    </div>
                </div>
                <div className="row" style={{ marginTop: "40px" }} >
                    <div className="col-6" style={{ margin: "auto" }}>
                        <form action="/login" onSubmit={e => this.submitHandler(e)}>
                            <div className="form-group">
                                <label >Tên tài khoản:</label>
                                <input type="text" className="form-control" id="username"
                                    name="username"
                                    onChange={e => this.changeHandler(e)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label >Mật khẩu:</label>
                                <input type="password" className="form-control" id="pwd"
                                    name="password"
                                    onChange={e => this.changeHandler(e)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginRight: "10px" }}>Đăng nhập</button>
                            <Link to="/forgetpassword">Quên mật khẩu</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Login.contextType = AppContext

export default withRouter(Login);
