import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/StudentAttendance.css';

class StudentAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            iconSize: '15px'
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value }, () => {
            console.log(this.state);
        });
    }
    submitHandler = async (e) => {
        // let data = this.state;
        // e.preventDefault();
        // console.log(data);
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
                            <label className="mr-1">Lớp:</label>
                            <select className="custom-select mr-2" name="class" id="class">
                                <option>Chọn lớp</option>
                                <option value="0">{this.state.classList[0]}</option>
                                <option value="1">{this.state.classList[1]}</option>
                                <option value="2">{this.state.classList[2]}</option>
                                <option value="3">{this.state.classList[3]}</option>
                            </select>
                            <label className="mr-1">Từ ngày</label>
                            <div className="mr-2">
                                <input className="form-control" type="date" />
                            </div>
                            <label className="mr-1">Đến ngày</label>
                            <div className="mr-2">
                                <input className="form-control" type="date" />
                            </div>
                            <button type="submit" className="btn btn-primary mr-2 ml-2">Lấy danh sách</button>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <table className="table table-bordered table-striped">
                            <thead className="text-center">
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>1/5</th>
                                    <th>2/5</th>
                                    <th>3/5</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1</td>
                                    <td>Nguyễn Thế Đức</td>
                                    <td>
                                        <select className="attendance-cell" name="term">
                                            <option value="0">KP</option>
                                            <option value="1">P</option>
                                        </select>    
                                    </td>
                                    <td>
                                        <select className="attendance-cell" name="term">
                                            <option value="0">KP</option>
                                            <option value="1">P</option>
                                        </select>    
                                    </td>
                                    <td>
                                        <select className="attendance-cell" name="term">
                                            <option value="0">KP</option>
                                            <option value="1">P</option>
                                        </select>    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" className="btn btn-primary" onClick={() => this.submitHandler()}>
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudentAttendance;
