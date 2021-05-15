import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/StudentScore.css';
import { IoMdArrowRoundBack } from "react-icons/io";

class StudentScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            schoolYear: "2020-2021",
            student: {
                name: "Hoàng Thế Anh",
                birthday: "19/12/1999",
                class: "9A"
            },
            iconSize: '15px'
        };
    }
    
    render() {
        return (
            <div className="container">
                <div className="row mt-3">
                    <div className="col-4">
                        <div className="form-inline">
                            <label style={{ marginRight: "5px" }}>Năm học:</label>
                            <select className="custom-select" name="schoolYear" id="schoolYear">
                                <option selected>Chọn năm học</option>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Học sinh: </b>{this.state.student.name}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Ngày sinh: </b>{this.state.student.birthday}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Lớp: </b>{this.state.student.class}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Năm học: </b>{this.state.schoolYear}
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered">
                            <thead className="text-center">
                                <tr>
                                    <th rowSpan="2">STT</th>
                                    <th rowSpan="2" className="subject">Môn học</th>
                                    <th colSpan="14">Học kỳ 1</th>
                                    <th colSpan="14">Học kỳ 2</th>
                                    <th rowSpan="2">TB kỳ 1</th>
                                    <th rowSpan="2">TB kỳ 2</th>
                                    <th rowSpan="2">TB năm</th>
                                </tr>
                                <tr>
                                    <th colSpan="5">Miệng</th>
                                    <th colSpan="5">15 phút</th>
                                    <th colSpan="3">1 tiết</th>
                                    <th >Thi</th>
                                    <th colSpan="5">Miệng</th>
                                    <th colSpan="5">15 phút</th>
                                    <th colSpan="3">1 tiết</th>
                                    <th >Thi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1.</td>
                                    <td>Toán</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered w-auto">
                            <thead className="text-center">
                                <tr>
                                    <th rowSpan="2">STT</th>
                                    <th rowSpan="2" className="subject">Môn học</th>
                                    <th colSpan="14">Học kỳ 1</th>
                                    <th colSpan="14">Học kỳ 2</th>
                                    <th rowSpan="2">TB kỳ 1</th>
                                    <th rowSpan="2">TB kỳ 2</th>
                                    <th rowSpan="2">TB năm</th>
                                </tr>
                                <tr>
                                    <th colSpan="7">Kiểm tra thường xuyên</th>
                                    <th colSpan="6">Kiểm tra định kỳ</th>
                                    <th >Thi</th>
                                    <th colSpan="7">Kiểm tra thường xuyên</th>
                                    <th colSpan="6">Kiểm tra định kỳ</th>
                                    <th >Thi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1.</td>
                                    <td>Thể dục</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td></td>
                                    <td></td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                    <td>9</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default StudentScore;
