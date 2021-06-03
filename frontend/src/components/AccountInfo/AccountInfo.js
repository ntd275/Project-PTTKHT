import React, { Component } from "react";
import '../../css/AccountInfo.css';
import Api from '../../api/api'
import AppContext from '../../context/AppContext'
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'

class AccountInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountInfo: {}
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        try {
            //console.log(this.context)
            let res;
            if (this.context.user.role === 0) {
                res = await Api.getStudentByCode(this.context.user.userCode)
            } else {
                res = await Api.getTeacherByCode(this.context.user.userCode)
            }
            console.log(res)
            this.setState({
                loading: false,
                accountInfo: res.data.result
            })

        } catch (err) {
            console.log(err)
        }
    }

    back = () => {
        this.props.history.goBack()
    }

    formatDate = (d) => {
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yyyy = d.getFullYear()
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return dd + '/' + mm + '/' + yyyy
    }

    render() {
        let { accountInfo } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Thông tin tài khoản
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row mt-3" >
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <img src={accountInfo.image} alt="Ảnh" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div className="panel-account-info col-9">
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Tên đăng nhập:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.context.user.accountName}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Họ tên:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.state.accountInfo.studentName || this.state.accountInfo.teacherName}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">{this.context.user.role ? "Mã giáo viên" : "Mã học sinh:"}</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.context.user.userCode}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Ngày sinh:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.formatDate(new Date(this.state.accountInfo.dateOfBirth))}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Giới tính:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.gender ? "Nam" : "Nữ"}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Số CMND:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.pId}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Hộ khẩu thường trú:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.permanentResidence}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Nơi ở hiện nay:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.address}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Ngày vào Đoàn:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.formatDate(new Date(accountInfo.dateOfUnion))}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Ngày vào Đảng:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{this.formatDate(new Date(accountInfo.dateOfParty))}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Điện thoại:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.phoneNumber}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <div className="label-account-info mr-2">Email:</div>
                            </div>
                            <div className="col-6">
                                <div className="account-info mr-2">{accountInfo.email}</div>
                            </div>
                        </div>
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Họ tên bố:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.fatherName}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Điện thoại bố:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.fatherPhone}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Email bố:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.fatherMail}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Họ tên mẹ:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.motherName}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Điện thoại mẹ:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.motherPhone}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role === 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Email mẹ:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.motherMail}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role !== 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Số hiệu công chức:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.civilServantNumber}</div>
                                </div>
                            </div>
                        }
                        {this.context.user.role !== 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <div className="label-account-info mr-2">Chuyên môn:</div>
                                </div>
                                <div className="col-6">
                                    <div className="account-info mr-2">{accountInfo.major}</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

AccountInfo.contextType = AppContext

export default withRouter(AccountInfo);
