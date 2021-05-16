import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/StudentPLL.css';

class StudentPLL extends Component {
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
                    <div className="col-3">
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
                    <div className="col-4">
                        <button type="button" class="btn btn-primary">Xuất file phiếu liên lạc</button>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-12 text-center pll-title">
                        <div>
                            <b>Phiếu liên lạc điện tử</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
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
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered">
                            <thead className="text-center">
                                <tr>
                                    <th >Tổng kết</th>
                                    <th >Điểm trung bình</th>
                                    <th >Học lực</th>
                                    <th >Hạnh kiểm</th>
                                    <th >Xếp hạng</th>
                                    <th >Danh hiệu</th>
                                    <th >Vắng có phép</th>
                                    <th >Vắng không phép</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>Học kỳ 1</td>
                                    <td>9</td>
                                    <td>Giỏi</td>
                                    <td>Tốt</td>
                                    <td>5</td>
                                    <td>Học sinh giỏi</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                                <tr className="text-center">
                                    <td>Học kỳ 2</td>
                                    <td>9</td>
                                    <td>Giỏi</td>
                                    <td>Tốt</td>
                                    <td>5</td>
                                    <td>Học sinh giỏi</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                                <tr className="text-center">
                                    <td>Cả năm</td>
                                    <td>9</td>
                                    <td>Giỏi</td>
                                    <td>Tốt</td>
                                    <td>5</td>
                                    <td>Học sinh giỏi</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered">
                            <thead className="text-center">
                                <tr>
                                    <th colSpan="2">Ý kiến PHHS</th>
                                    <th colSpan="2">Ý kiến GVCN</th>
                                    <th colSpan="2">Kết quả cuối năm</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-left">
                                    <td colSpan="2"></td>
                                    <td colSpan="2"></td>
                                    <td colSpan="2">
                                        Được lên lớp:<br />
                                        Thi lại môn:
                                    </td>
                                </tr>
                                <tr className="text-center">
                                    <td colSpan="3">
                                        <b>Hiệu trưởng</b>
                                    </td>
                                    <td colSpan="3">
                                        Hà Nội, ngày 15 tháng 05 năm 2021<br />
                                        Giáo viên chủ nhiệm<br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        Bùi Minh Tuấn
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

export default StudentPLL;
