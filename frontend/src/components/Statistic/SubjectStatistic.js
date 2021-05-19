import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/Statistic/SubjectStatistic.css';

class SubjectStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            schoolYear: 0,
            classList: ["9A", "9B", "9C", "9D"],
            class: 0,
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
                            <select className="custom-select mr-2" name="schoolYear" id="schoolYear" onChange={e => this.changeHandler(e)}>
                                <option>Chọn năm học</option>
                                <option value="0">{this.state.schoolYearList[0]}</option>
                                <option value="1">{this.state.schoolYearList[1]}</option>
                                <option value="2">{this.state.schoolYearList[2]}</option>
                                <option value="3">{this.state.schoolYearList[3]}</option>
                            </select>
                            <label className="mr-1">Lớp:</label>
                            <select className="custom-select mr-2" name="class" id="class" onChange={e => this.changeHandler(e)}>
                                <option>Chọn lớp</option>
                                <option value="0">{this.state.classList[0]}</option>
                                <option value="1">{this.state.classList[1]}</option>
                                <option value="2">{this.state.classList[2]}</option>
                                <option value="3">{this.state.classList[3]}</option>
                            </select>
                            <label className="mr-1">Học kỳ:</label>
                            <select className="custom-select mr-2" name="term" id="term" onChange={e => this.changeHandler(e)}>
                                <option>Chọn học kỳ</option>
                                <option value="0">Cả năm</option>
                                <option value="1">Học kỳ 1</option>
                                <option value="2">Học kỳ 2</option>
                            </select>
                            <button type="submit" className="btn btn-primary mr-2">Xem kết quả</button>
                        </form>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-primary mr-2">Xuất file</button>
                        <button type="button" className="btn btn-primary mr-2">In thống kê</button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 text-center statistic-title">
                        <div>
                            <b>Thống kê xếp loại môn học của lớp {this.state.classList[this.state.class]}</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <span className="mr-5 ml-5">
                            <b>Học kỳ: </b>{this.state.termList[this.state.term]}
                        </span>
                        <span className="mr-5 ml-5">
                            <b>Năm học: </b>{this.state.schoolYearList[this.state.schoolYear]}
                        </span>
                        <span className="mr-5 ml-5">
                            <b>Giáo viên chủ nhiệm: </b>{this.state.homeroomTeacher}
                        </span>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered table-striped">
                            <thead className="text-center">
                                <tr>
                                    <th rowSpan="2" colSpan="2"></th>
                                    <th colSpan="2">Giỏi</th>
                                    <th colSpan="2">Khá</th>
                                    <th colSpan="2">Trung Bình</th>
                                    <th colSpan="2">Yếu</th>
                                    <th colSpan="2">Kém</th>
                                </tr>
                                <tr>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td rowSpan="2" className="align-middle">Toán</td>
                                    <td>Nữ</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td>TC</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td rowSpan="2" className="align-middle">Toán</td>
                                    <td>Nữ</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td>TC</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                </tr>
                            </tbody>
                        </table>
                        Các môn nhật xét:
                        <table className="table table-bordered table-striped mt-2">
                            <thead className="text-center">
                                <tr>
                                    <th rowSpan="2" colSpan="2"></th>
                                    <th colSpan="2">Đạt</th>
                                    <th colSpan="2">Không đạt</th>
                                    <th colSpan="2">Miễn</th>
                                </tr>
                                <tr>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                    <th>SL</th>
                                    <th>TL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td rowSpan="2" className="align-middle">Thể dục</td>
                                    <td>Nữ</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td>TC</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td rowSpan="2" className="align-middle">Thể dục</td>
                                    <td>Nữ</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                    <td>1</td>
                                    <td>20%</td>
                                </tr>
                                <tr className="text-center">
                                    <td>TC</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                    <td>2</td>
                                    <td>20%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-end">
                    <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 text-center">
                        Hà Nội, ngày 15 tháng 05 năm 2021<br />
                        Giáo viên chủ nhiệm<br />
                        <br />
                        <br />
                        <br />
                        Bùi Minh Tuấn
                    </div>
                </div>
                
            </div>
        );
    }
}

export default SubjectStatistic;
