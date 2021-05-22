import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { Modal } from 'react-bootstrap';
// import '../../css/HomeroomTeacherAssignment.css';

class HomeroomTeacherAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            schoolYear: 0,
            classList: ["9A", "9B", "9C", "9D"],
            class: 0,
            termList: ["Cả năm", "Học kỳ 1", "Học kỳ 2"],
            term: 0,
            teacherList: ["Bùi Minh Tuấn", "Nguyễn Thế Đức", "Hoàng Thế Anh", "Trần Tiến Anh"],
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
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label className="mr-1">Năm học:</label>
                            <select className="custom-select mr-2" name="schoolYear" id="schoolYear">
                                <option>Chọn năm học</option>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <label className="mr-1">Giáo viên:</label>
                            <input type="text" className="form-control mr-2" />
                            <label className="mr-1">Lớp:</label>
                            <input type="text" className="form-control" />
                            <button type="button" className="btn btn-primary btn-sm ml-4" onClick={() => {}}>
                                <BiSearch size={this.state.iconSize} />Tìm kiếm
                            </button>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <table className="table table-bordered table-striped">
                            <thead className="text-center">
                                <tr>
                                    <th>STT</th>
                                    <th>Lớp</th>
                                    <th>Mã số giáo viên</th>
                                    <th>Họ tên</th>
                                    <th>Năm học</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1</td>
                                    <td>9A</td>
                                    <td>GV01</td>
                                    <td>Nguyễn Thế Đức</td>
                                    <td>2020-2021</td>
                                    <td>
                                        {/* Button trigger modal */}
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.modalHandler()}>
                                            <FiEdit size={this.state.iconSize} />
                                        </button>
                                        {/* <!-- Modal --> */}
                                        <Modal show={this.state.showModal}>
                                            <Modal.Header>Phân công GVCN</Modal.Header>
                                            <Modal.Body>
                                                <div className="form-group">
                                                    <label className="mr-1">Năm học:</label>
                                                    <select className="custom-select mr-2" name="schoolYear" onChange={e => this.changeHandler(e)}>
                                                        <option value="0">{this.state.schoolYearList[0]}</option>
                                                        <option value="1">{this.state.schoolYearList[1]}</option>
                                                        <option value="2">{this.state.schoolYearList[2]}</option>
                                                        <option value="3">{this.state.schoolYearList[3]}</option>
                                                    </select>
                                                    <label className="mr-1">Lớp:</label>
                                                    <select className="custom-select mr-2" name="class" onChange={e => this.changeHandler(e)}>
                                                        <option value="0">{this.state.classList[0]}</option>
                                                        <option value="1">{this.state.classList[1]}</option>
                                                        <option value="2">{this.state.classList[2]}</option>
                                                        <option value="3">{this.state.classList[3]}</option>
                                                    </select>
                                                    <label className="mr-1">Giáo viên:</label>
                                                    <select className="custom-select mr-2" name="teacher" onChange={e => this.changeHandler(e)}>
                                                        <option value="0">{this.state.teacherList[0]}</option>
                                                        <option value="1">{this.state.teacherList[1]}</option>
                                                        <option value="2">{this.state.teacherList[2]}</option>
                                                        <option value="3">{this.state.teacherList[3]}</option>
                                                    </select>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.modalHandler()}>
                                                    Lưu
                                                </button>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.modalHandler()}>
                                                    Đóng
                                                </button>
                                            </Modal.Footer>
                                        </Modal>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeroomTeacherAssignment;
