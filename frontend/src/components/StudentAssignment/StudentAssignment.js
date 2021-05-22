import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi';
import { BiSearch, BiRefresh } from 'react-icons/bi';
import { IoIosAdd } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaFileDownload, FaFileUpload } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import '../../css/StudentAssignment.css';

class StudentAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            showDeleteModal: false,
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            schoolYear: 0,
            classList: ["9A", "9B", "9C", "9D"],
            class: 0,
            termList: ["Cả năm", "Học kỳ 1", "Học kỳ 2"],
            term: 0,
            studentList: ["Bùi Minh Tuấn", "Nguyễn Thế Đức", "Hoàng Thế Anh", "Trần Tiến Anh"],
            subjectList: ["Toán", "Lý", "Hóa", "Văn", "Anh"],
            student: {
                name: "Hoàng Thế Anh",
                birthday: "19/12/1999",
                class: "9A"
            },
            iconSize: '20px'
        };
    }
    addModalHandler = () => {
        this.setState({
            showAddModal: !this.state.showAddModal
        });
    }
    deleteModalHandler = () => {
        this.setState({
            showDeleteModal: !this.state.showDeleteModal
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
                            {/* Button trigger modal */}
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => this.addModalHandler()}>
                                <IoIosAdd size={this.state.iconSize} />Thêm học sinh vào lớp
                            </button>
                            <label className="mr-1 ml-4">Số lượng bản ghi mỗi trang:</label>
                            <input type="text" className="mr-2 input-number" />
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={() => { }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
                            {/* <!-- Modal --> */}
                            <Modal show={this.state.showAddModal}>
                                <Modal.Header>Thêm học sinh vào lớp</Modal.Header>
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
                                        <label className="mr-1">Học sinh:</label>
                                        <select className="custom-select mr-2" name="teacher" onChange={e => this.changeHandler(e)}>
                                            <option value="0">{this.state.studentList[0]}</option>
                                            <option value="1">{this.state.studentList[1]}</option>
                                            <option value="2">{this.state.studentList[2]}</option>
                                            <option value="3">{this.state.studentList[3]}</option>
                                        </select>
                                        <div className="text-center mt-3">
                                            <button type="button" className="btn btn-primary btn-sm mr-2" onClick={() => this.addModalHandler()}>
                                                Lưu
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => this.addModalHandler()}>
                                                Đóng
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="m-auto">
                                    <div className="text-center">
                                        <b>Hoặc</b>
                                        <div className="text-center mt-1">
                                            <button type="button" className="btn btn-primary btn-sm mr-2" onClick={() => this.addModalHandler()}>
                                                <FaFileUpload size={this.state.iconSize} /> Import từ file Excel
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => this.addModalHandler()}>
                                                <FaFileDownload size={this.state.iconSize} /> Tải file mẫu
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </form>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label className="mr-1">Năm học:</label>
                            <select className="mr-4 form-control-sm" name="schoolYear" id="schoolYear">
                                <option>Chọn năm học</option>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <label className="mr-1">Lớp:</label>
                            <input type="text" className="input-class mr-4" />
                            <label className="mr-1">Học sinh:</label>
                            <input type="text" className="input-student mr-4" />
                            <button type="button" className="btn btn-primary btn-sm ml-4" onClick={() => { }}>
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
                                    <th>Mã số học sinh</th>
                                    <th>Họ tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Nơi sinh</th>
                                    <th>
                                        <input type="checkbox" value="" className="checkbox-assignment" />
                                    </th>
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
                                    <td>
                                        <input type="checkbox" value="" className="checkbox-assignment" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* Button trigger modal */}
                        <button type="button" className="btn btn-primary btn-sm ml-4" onClick={() => this.deleteModalHandler()}>
                            <RiDeleteBin6Line size={this.state.iconSize} /> Xóa
                        </button>
                        {/* <!-- Modal --> */}
                        <Modal show={this.state.showDeleteModal}>
                            <Modal.Header>Xóa học sinh</Modal.Header>
                            <Modal.Body>
                                Bạn có chắc chắn muốn xóa?
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="button" className="btn btn-primary btn-sm btn-danger" onClick={() => this.deleteModalHandler()}>
                                    Xóa
                                </button>
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.deleteModalHandler()}>
                                    Đóng
                                </button>
                            </Modal.Footer>
                        </Modal>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudentAssignment;
