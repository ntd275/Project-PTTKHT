import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi';
import { Modal } from 'react-bootstrap';
// import '../../css/TransferClass.css';

class TransferClass extends Component {
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
                            <label className="mr-1">Chọn lớp kết chuyển:</label>
                            <select className="mr-4 form-control-sm" name="class" id="class">
                                <option>Chọn lớp</option>
                                <option value="0">{this.state.classList[0]}</option>
                                <option value="1">{this.state.classList[1]}</option>
                                <option value="2">{this.state.classList[2]}</option>
                                <option value="3">{this.state.classList[3]}</option>
                            </select>
                            <label className="mr-1">Năm học:</label>
                            <select className="custom-select mr-2" name="schoolYear" onChange={e => this.changeHandler(e)}>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={() => { }}>
                                OK
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
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label className="mr-1">Chọn lớp kết chuyển lên:</label>
                            <select className="mr-4 form-control-sm" name="class" id="class">
                                <option>Chọn lớp</option>
                                <option value="0">{this.state.classList[0]}</option>
                                <option value="1">{this.state.classList[1]}</option>
                                <option value="2">{this.state.classList[2]}</option>
                                <option value="3">{this.state.classList[3]}</option>
                            </select>
                            <label className="mr-1">Năm học:</label>
                            <select className="custom-select mr-2" name="schoolYear" onChange={e => this.changeHandler(e)}>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={() => { }}>
                                Kết chuyển lên
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransferClass;
