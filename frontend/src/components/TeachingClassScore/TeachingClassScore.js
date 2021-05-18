import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/TeachingClassScore.css';

class TeachingClassScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYear: "2020-2021",
            class: "9A",
            term: 1,
            subject: "Toán",
        };
    }
    // changeHandler = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;
    //     this.setState({ [name]: value }, () => {
    //         console.log(this.state);
    //     });
    // }
    // submitHandler = async (e) => {
    //     let data = this.state;
    //     e.preventDefault();
    //     console.log(data);
    //     // let res = await Api.login(data.username, data.password)
    //     // console.log(res)
    // }
    render() {
        return (
            <div className="container">
                <div className="row mt-3">
                    <div className="col-6 mt-1">
                        <span className="mr-4 align-middle">
                            <b>Năm học: </b>{this.state.schoolYear}
                        </span>
                        <span className="mr-4 align-middle">
                            <b>Lớp: </b>{this.state.class}
                        </span>
                        <span className="mr-4 align-middle">
                            <b>Học kỳ: </b>{this.state.term}
                        </span>

                        <span className="align-middle">
                            <b>Môn: </b>{this.state.subject}
                        </span>
                    </div>
                    <div className="col-6">
                        <button type="button" className="btn btn-primary mr-4">Nhập điểm từ file Excel</button>
                        <button type="button" className="btn btn-primary">Xuất file điểm</button>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <form className="text-center">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>MSHS</th>
                                        <th>Họ tên</th>
                                        <th colSpan="5">Miệng</th>
                                        <th colSpan="5">15 phút</th>
                                        <th colSpan="3">1 tiết</th>
                                        <th>thi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td>1</td>
                                        <td>HS01</td>
                                        <td>Nguyễn Thế Đức</td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                    </tr>
                                    <tr className="text-center">
                                        <td>1</td>
                                        <td>HS01</td>
                                        <td>Nguyễn Thế Đức</td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="" /></td>
                                        <td><input className="score-input" type="text" id="" placeholder="9" /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="submit" className="btn btn-primary">Lưu</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeachingClassScore;