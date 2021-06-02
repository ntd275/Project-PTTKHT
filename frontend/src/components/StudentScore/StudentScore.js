import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/StudentScore.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'

class StudentScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            iconSize: '15px',
            searchCondition: {},
            student: {},
            scoreList: [],
            studentAssignment: {},
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, student] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getStudentByCode(this.context.user.userCode),
            ])
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                studentId: student.data.result.studentId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                student: student.data.result,
                searchCondition: searchCondition,
                loading: false
            })
            await this.refresh()
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Thông báo",
                    message: "Danh sách rỗng",
                    type: "info",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                return
            }
            store.addNotification({
                title: "Hệ thống có lỗi",
                message: "Vui lòng liên hệ quản trị viên hoặc thử lại sau",
                type: "danger",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
        }
    }

    back = () => {
        this.props.history.goBack()
    }

    refresh = async (searchCondition) => {
        this.setState({ loading: true })
        try {
            let [res, studentAssignment] = await Promise.all([
                Api.getStudentScoreSummary(searchCondition || this.state.searchCondition),
                Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            ])
            console.log(res, studentAssignment)
            this.setState({
                scoreList: res.data.data,
                studentAssignment: studentAssignment.data.result.data[0],
                loading: false,
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Thông báo",
                    message: "Danh sách rỗng",
                    type: "info",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                return
            }
            store.addNotification({
                title: "Hệ thống có lỗi",
                message: "Vui lòng liên hệ quản trị viên hoặc thử lại sau",
                type: "danger",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
        }
    }

    getSchoolYearOption = () => {
        let list = this.state.schoolYearList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { schoolYearId, schoolYear } = list[i];
            options.push({
                name: schoolYear,
                value: schoolYearId
            })
        }
        return options
    }

    changeSearchCondition = (name, value) => {
        console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        this.setState({ searchCondition: searchCondition })
        this.refresh(searchCondition)
    }

    renderTableData() {
        let scoreList = this.state.scoreList;
        let row = [];
        for (let i = 0; i < scoreList.length; i++) {
            let { subjectName, score1, score2, avgScore1, avgScore2, avgScoreYear } = scoreList[i];
            row.push(
                <tr className="text-center">
                    <td>{i + 1}</td>
                    <td>{subjectName}</td>
                    <td>{score1[0][0]}</td>
                    <td>{score1[0][1]}</td>
                    <td>{score1[0][2]}</td>
                    <td>{score1[0][3]}</td>
                    <td>{score1[0][4]}</td>
                    <td>{score1[1][0]}</td>
                    <td>{score1[1][1]}</td>
                    <td>{score1[1][2]}</td>
                    <td>{score1[1][3]}</td>
                    <td>{score1[1][4]}</td>
                    <td>{score1[2][0]}</td>
                    <td>{score1[2][1]}</td>
                    <td>{score1[2][2]}</td>
                    <td>{score1[3][0]}</td>
                    <td>{score2[0][0]}</td>
                    <td>{score2[0][1]}</td>
                    <td>{score2[0][2]}</td>
                    <td>{score2[0][3]}</td>
                    <td>{score2[0][4]}</td>
                    <td>{score2[1][0]}</td>
                    <td>{score2[1][1]}</td>
                    <td>{score2[1][2]}</td>
                    <td>{score2[1][3]}</td>
                    <td>{score2[1][4]}</td>
                    <td>{score2[2][0]}</td>
                    <td>{score2[2][1]}</td>
                    <td>{score2[2][2]}</td>
                    <td>{score2[3][0]}</td>
                    <td>{avgScore1}</td>
                    <td>{avgScore2}</td>
                    <td>{avgScoreYear}</td>
                </tr>
            )
        }
        return row;
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
        if (this.state.loading) {
            return (
                <div className="container-fluid d-flex justify-content-center">
                    <div className="d-flex justify-content-center text-primary mt-auto mb-auto">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div >
            )
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Tra cứu điểm
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-4">
                        <div className="form-inline">
                            <label>Năm học:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={this.getSchoolYearOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.schoolYearId}
                                    onChange={v => this.changeSearchCondition("schoolYearId", v)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Học sinh: </b> {this.state.student.studentName}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Ngày sinh: </b> {this.formatDate(new Date(this.state.student.dateOfBirth))}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Lớp: </b> {this.state.studentAssignment.className}
                        </div>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                        <div>
                            <b>Năm học: </b> {this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId) && this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId).schoolYear}
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered student-score-summary">
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
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

StudentScore.contextType = AppContext

export default withRouter(StudentScore);
