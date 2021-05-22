import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi'
import { Modal } from 'react-bootstrap';
import '../../css/ConductAssessment.css';

class ConductAssessment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            schoolYear: "2020-2021",
            classList: ["9A", "9B", "9C", "9D"],
            class: "9A",
            termList: ["Cả năm", "Học kỳ 1", "Học kỳ 2"],
            term: 0,
            homeroomTeacher: "Bùi Minh Tuấn",
            student: {
                name: "Hoàng Thế Anh",
                birthday: "19/12/1999",
                class: "9A"
            },
            iconSize: '20px'
        };
    }
    modalHandler = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value }, () => {
            console.log(this.state);
        });
    }
    submitHandler = async (e) => {
        let data = this.state;
        e.preventDefault();
        console.log(data);
        // let res = await Api.login(data.username, data.password)
        // console.log(res)
    }
    render() {
        return (
            <div className="container">
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label className="mr-1">Năm học:</label>
                            <select className="custom-select mr-2" name="schoolYear" id="schoolYear">
                                <option>Chọn năm học</option>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <label className="mr-1">Học kỳ:</label>
                            <select className="custom-select mr-2" name="term" id="term" onChange={e => this.changeHandler(e)}>
                                <option>Chọn học kỳ</option>
                                <option value="1">Học kỳ 1</option>
                                <option value="2">Học kỳ 2</option>
                            </select>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 text-center conduct-title">
                        <div>
                            <b>Phiếu đánh giá hạnh kiểm</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <span className="mr-5">
                            <b>Năm học: </b>{this.state.schoolYear}
                        </span>
                        <span className="mr-5">
                            <b>Học kỳ: </b>{this.state.termList[this.state.term]}
                        </span>
                        <span className="mr-5">
                            <b>Lớp: </b>{this.state.student.class}
                        </span>
                        <span className="mr-5">
                            <b>Sĩ số: </b>30
                        </span>
                        <span className="mr-5">
                            <b>Giáo viên chủ nhiệm: </b>{this.state.homeroomTeacher}
                        </span>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <table className="table table-bordered table-striped">
                            <thead className="text-center">
                                <tr>
                                    <th>STT</th>
                                    <th>MSHS</th>
                                    <th>Họ tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Nơi sinh</th>
                                    <th>Hạnh kiểm</th>
                                    <th>Ý kiến giáo viên</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1</td>
                                    <td>HS01</td>
                                    <td>Nguyễn Thế Đức</td>
                                    <td>27/05/1999</td>
                                    <td>Nam</td>
                                    <td>Hưng Yên</td>
                                    <td>Tốt</td>
                                    <td></td>
                                    <td>
                                        {/* Button trigger modal */}
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.modalHandler()}>
                                            <FiEdit size={this.state.iconSize} />
                                        </button>
                                        {/* <!-- Modal --> */}
                                        <Modal show={this.state.showModal}>
                                            <Modal.Header>Đánh giá hạnh kiểm</Modal.Header>
                                            <Modal.Body>
                                                <div className="form-group">
                                                    <label className="mr-1">Hạnh kiểm:</label>
                                                    <select className="custom-select mr-2" name="conduct" onChange={e => this.changeHandler(e)}>
                                                        <option value="1">Giỏi</option>
                                                        <option value="2">Khá</option>
                                                        <option value="3">Trung bình</option>
                                                        <option value="4">Yếu</option>
                                                        <option value="5">Kém</option>
                                                    </select>
                                                    <label>Ý kiến giáo viên:</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.modalHandler()}>
                                                    Đóng
                                                </button>
                                            </Modal.Footer>
                                        </Modal>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="btn btn-primary">
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConductAssessment;
