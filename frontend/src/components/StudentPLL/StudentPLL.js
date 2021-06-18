import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/StudentPLL.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'
import Pdf from "react-to-pdf";
const ref = React.createRef()
class StudentPLL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            iconSize: '15px',
            searchCondition: {},
            studentList: [],
            classList: [],
            loading: false,
            showReport: false,
            scoreList: [],
            PLL: {},
            date: new Date(),
            teacher: {}
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, student] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getStudentByCode(this.context.user.userCode)
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                studentId: student.data.result.studentId,
            }
            console.log(searchCondition)
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                searchCondition: searchCondition,
                loading: false,
                student: student.data.result
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

    back = () => {
        this.props.history.goBack()
    }

    refresh = async (searchCondition) => {
        this.setState({ loading: true, showReport: false })
        try {

            let studentAssignment = await Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            if (studentAssignment.data.result.data.length === 0) {
                store.addNotification({
                    title: "Thông báo",
                    message: "Bạn không có phiếu liên lạc trong thời điểm này",
                    type: "info",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.setState({
                    loading: false,
                    showReport: false
                })
                return
            }
            let [res, score, teacher] = await Promise.all([
                Api.getPLL(searchCondition || this.state.searchCondition),
                Api.getStudentScoreSummary(searchCondition || this.state.searchCondition),
                Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            ])
            console.log(res, score)
            this.setState({
                teacher: teacher.data.result.data[0],
                studentAssignment: studentAssignment.data.result.data[0],
                scoreList: score.data.data,
                PLL: res.data,
                showReport: true,
                loading: false,
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
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

    changeSearchCondition = async (name, value) => {
        //console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        if (name === "schoolYearId") {
            this.setState({ loading: true, showReport: false })
            try {
                let studentAssignment = await Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
                if (studentAssignment.data.result.data.length === 0) {
                    store.addNotification({
                        title: "Thông báo",
                        message: "Bạn không có phiếu liên lạc trong thời điểm này",
                        type: "info",
                        container: "top-center",
                        dismiss: {
                            duration: 5000,
                            showIcon: true,
                        },
                        animationIn: ["animate__backInDown", "animate__animated"],
                        animationOut: ["animate__fadeOutUp", "animate__animated"],
                    })
                }
                this.setState({
                    loading: false,
                    studentAssignment: studentAssignment.data.result.data[0],
                    searchCondition: searchCondition,
                })
            } catch (err) {
                this.setState({
                    loading: false,
                    classList: [],
                    studentList: [],
                    searchCondition: searchCondition,
                })
                console.log(err)
            }
        }
    }

    formatDate = (d) => {
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yyyy = d.getFullYear()
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return dd + '/' + mm + '/' + yyyy
    }

    renderTableData() {
        let scoreList = this.state.scoreList;
        let row = [];
        for (let i = 0; i < scoreList.length; i++) {
            let { subjectName, score1, score2, avgScore1, avgScore2, avgScoreYear } = scoreList[i];
            row.push(
                <tr className="text-center" key={i}>
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

        let { PLL } = this.state
        let student = this.state.student
        let _class = this.state.studentAssignment
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Xuất phiếu liên lạc
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
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
                            <button onClick={() => this.refresh()} type="button" className="btn btn-primary ml-auto">Xem phiếu liên lạc</button>
                            {this.state.showReport &&
                                <div className="col-3">
                                    <Pdf targetRef={ref} filename="phieu-lien-lac.pdf" scale={0.52} y={7}>
                                        {({ toPdf }) => <button type="button" className="btn btn-primary ml-3" onClick={toPdf}>Xuất file phiếu liên lạc</button>}
                                    </Pdf>
                                </div>
                            }
                        </div>
                    </div>

                </div>
                <hr />
                {this.state.showReport &&
                    <div ref={ref} className="d-flex" style={{ overflow: "auto" }} >
                        <div style={{ width: "380mm" }} className="ml-auto mr-auto">
                            <div className="row mt-3">
                                <div className="col-12 text-center pll-title">
                                    <div>
                                        <b>Phiếu liên lạc điện tử</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                                    <div>
                                        <b>Học sinh: </b>{student.studentName}
                                    </div>
                                </div>
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                                    <div>
                                        <b>Ngày sinh: </b>{this.formatDate(new Date(student.dateOfBirth))}
                                    </div>
                                </div>
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                                    <div>
                                        <b>Lớp: </b> { } {_class.className}
                                    </div>
                                </div>
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center">
                                    <div>
                                        <b>Năm học: </b>{_class.schoolYear}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
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
                            <div className="row mt-2">
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
                                                <td>{PLL.result1.avgScore}</td>
                                                <td>{PLL.result1.scoreTitle}</td>
                                                <td>{PLL.result1.conductTitle}</td>
                                                <td>{PLL.result1.rank}</td>
                                                <td>{PLL.result1.title}</td>
                                                <td>{PLL.result1.nVangCoPhep}</td>
                                                <td>{PLL.result1.nVangKoPhep}</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Học kỳ 2</td>
                                                <td>{PLL.result2.avgScore}</td>
                                                <td>{PLL.result2.scoreTitle}</td>
                                                <td>{PLL.result2.conductTitle}</td>
                                                <td>{PLL.result2.rank}</td>
                                                <td>{PLL.result2.title}</td>
                                                <td>{PLL.result2.nVangCoPhep}</td>
                                                <td>{PLL.result2.nVangKoPhep}</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Cả năm</td>
                                                <td>{PLL.result0.avgScore}</td>
                                                <td>{PLL.result0.scoreTitle}</td>
                                                <td>{PLL.result0.conductTitle}</td>
                                                <td>{PLL.result0.rank}</td>
                                                <td>{PLL.result0.title}</td>
                                                <td>{PLL.result0.nVangCoPhep}</td>
                                                <td>{PLL.result0.nVangKoPhep}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row mt-2">
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
                                                <td colSpan="2">{PLL.result1.note} {"\n"} {PLL.result2.note}</td>
                                                <td colSpan="2">
                                                    Được lên lớp:<br />{PLL.result0.isGradeUp}
                                        Thi lại môn:
                                    </td>
                                            </tr>
                                            <tr className="text-center">
                                                <td colSpan="3">
                                                    <b>Hiệu trưởng</b>
                                                </td>
                                                <td colSpan="3">
                                                    Hà Nội, ngày {this.state.date.getDate() < 10 ? "0" + this.state.date.getDate() : this.state.date.getDate()} tháng {this.state.date.getMonth() < 9 ? "0" + (this.state.date.getMonth() + 1) : this.state.date.getMonth() + 1} năm {this.state.date.getFullYear()}<br />
                        Giáo viên chủ nhiệm<br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    {this.state.teacher.teacherName}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div >
        );
    }
}

StudentPLL.contextType = AppContext

export default withRouter(StudentPLL);
