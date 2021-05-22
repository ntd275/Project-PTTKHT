import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Api from "../../api/api";
import AppContext from '../../context/AppContext'
import jwt from 'jwt-decode'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
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
        console.log(data);

        try {
            //let res = await Api.login(data.username, data.password)
            //fake res
            let res = {
                data: {
                    success: true,
                    accessToken: "123",
                }
            }
            localStorage.setItem("accessToken", res.data.accessToken)
            //let user = jwt.decode(res.data.accessToken)
            //fake user
            let user = {
                accountName: "Duc",
                role: 1,
            }
            //to
            this.context.setUser(user)
            //redirect
            this.props.history.push('/')
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div className="container">
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
                                />
                            </div>
                            <div className="form-group">
                                <label >Mật khẩu:</label>
                                <input type="password" className="form-control" id="pwd"
                                    name="password"
                                    onChange={e => this.changeHandler(e)}
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
Login.defaultProps = {
    message: 'Hello',

};
export default withRouter(Login);
