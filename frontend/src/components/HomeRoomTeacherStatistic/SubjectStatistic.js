import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/Statistic/SubjectStatistic.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'

class SubjectStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            iconSize: '15px',
            searchCondition: {},
            homeroomTeacher: "",
            date: new Date(),
            scoreList: [],
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, teacher] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getTeacherByCode(this.context.user.userCode)
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                teacherId: teacher.data.result.teacherId,
                term: 1,
            }
            let homeroomClass = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
            if (homeroomClass.data.result.data.length) {
                searchCondition.classId = homeroomClass.data.result.data[0].classId
            }
            //console.log(searchCondition)
            this.setState({
                classList: homeroomClass.data.result.data,
                schoolYearList: schoolYearList.data.result.data,
                searchCondition: searchCondition,
                loading: false
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
            if (!this.state.searchCondition.classId) {
                store.addNotification({
                    title: "Thông báo",
                    message: "Bạn không là giáo viên chủ nhiệm lớp trong năm học này",
                    type: "info",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.setState({ loading: false, showReport: false })
                return
            }
            let res = await Api.getSubjectReport(1, 1000000, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                scoreList: res.data.data,
                homeroomTeacher: res.data.homeroomTeacher,
                loading: false,
                showReport: true,
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

    getClassOption = () => {
        let list = this.state.classList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { classId, className } = list[i];
            options.push({
                name: className,
                value: classId
            })
        }
        return options
    }

    changeSearchCondition = async (name, value) => {
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        if (name === "schoolYearId") {
            this.setState({ loading: true, showReport: false })
            searchCondition.classId = undefined;
            try {
                let classList = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
                if (classList.data.result.data.length) {
                    searchCondition.classId = classList.data.result.data[0].classId
                }
                this.setState({
                    loading: false,
                    classList: classList.data.result.data,
                    searchCondition: searchCondition,
                })
            } catch (err) {
                this.setState({
                    loading: false,
                    classList: [],
                    searchCondition: searchCondition,
                })
                console.log(err)
            }
        }
    }

    renderTableData() {
        let row = []
        let list = this.state.scoreList
        for (let i = 0; i < list.length; i++) {
            const { nGioi, nKem, nKha, nNuGioi, nNuKem, nNuKha, nNuTB, nNuYeu, nTB, nYeu, subjectName, tlGioi, tlKem, tlKha, tlNuGioi, tlNuKem, tlNuKha, tlNuTB, tlNuYeu, tlTB, tlYeu } = list[i];
            row.push(
                <tr className="text-center" key={i}>
                    <td rowSpan="2" className="align-middle">{subjectName}</td>
                    <td>Nữ</td>
                    <td>{nNuGioi}</td>
                    <td>{tlNuGioi}</td>
                    <td>{nNuKha}</td>
                    <td>{tlNuKha}</td>
                    <td>{nNuTB}</td>
                    <td>{tlNuTB}</td>
                    <td>{nNuYeu}</td>
                    <td>{tlNuYeu}</td>
                    <td>{nNuKem}</td>
                    <td>{tlNuKem}</td>
                </tr>
            )
            row.push(
                <tr className="text-center" key={"TC" + i}>
                    <td>TC</td>
                    <td>{nGioi}</td>
                    <td>{tlGioi}</td>
                    <td>{nKha}</td>
                    <td>{tlKha}</td>
                    <td>{nTB}</td>
                    <td>{tlTB}</td>
                    <td>{nYeu}</td>
                    <td>{tlYeu}</td>
                    <td>{nKem}</td>
                    <td>{tlKem}</td>
                </tr>
            )
        }
        return row
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
            <div className="container">
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Thống kê kết quả môn học
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline" >
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
                            <label className="ml-2">Lớp:</label>
                            <div className="ml-1 select-class">
                                <SelectSearch
                                    options={this.getClassOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.classId}
                                    onChange={v => this.changeSearchCondition("classId", v)}
                                    disabled={true}
                                />
                            </div>
                            <label className="ml-2">Học kỳ:</label>
                            <div className="ml-1 select-term">
                                <SelectSearch
                                    options={[{ name: "Cả năm", value: 0 }, { name: "1", value: 1 }, { name: "2", value: 2 }]}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.term}
                                    onChange={v => this.changeSearchCondition("term", v)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary ml-3" onClick={(e) => { e.preventDefault(); this.refresh() }}>Xem kết quả</button>
                        </form>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-primary mr-2">Xuất file</button>
                        <button type="button" className="btn btn-primary mr-2">In thống kê</button>
                    </div>
                </div>
                <hr />
                {this.state.showReport &&
                    <div className="row">
                        <div className="col-12 text-center statistic-title">
                            <div>
                                <b>Thống kê xếp loại môn học của lớp {this.state.classList[this.state.class]}</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                        </div>
                    </div>
                }
                {this.state.showReport &&
                    <div className="row mt-3">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <span className="mr-5 ml-5">
                                <b>Học kỳ: </b> {this.state.searchCondition.term === 0 ? "Cả năm" : this.state.searchCondition.term}
                            </span>
                            <span className="mr-5 ml-5">
                                <b>Năm học: </b> {this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId) && this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId).schoolYear}
                            </span>
                            <span className="mr-5 ml-5">
                                <b>Giáo viên chủ nhiệm: </b> {this.state.homeroomTeacher}
                            </span>
                        </div>
                    </div>
                }
                { this.state.showReport &&
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
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                { this.state.showReport &&
                    <div className="row mt-3 mb-2 justify-content-end">
                        <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 text-center">
                            Hà Nội, ngày {this.state.date.getDate()} tháng {this.state.date.getMonth() + 1} năm {this.state.date.getFullYear()}<br />
                        Giáo viên chủ nhiệm<br />
                            <br />
                            <br />
                            <br />
                            {this.state.homeroomTeacher}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
SubjectStatistic.contextType = AppContext

export default withRouter(SubjectStatistic);
