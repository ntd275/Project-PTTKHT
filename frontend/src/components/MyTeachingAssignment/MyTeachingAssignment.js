import React, { Component } from "react";
import Api from "../../api/api";
import { BiSearch, BiRefresh, } from 'react-icons/bi';
import { BsArrowLeftShort } from 'react-icons/bs'
import '../../css/TeachingAssignment.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { withRouter } from 'react-router-dom'
import 'react-select-search/style.css'
import AppContext from '../../context/AppContext'

class MyTeachingAssignment extends Component {
    constructor(props) {
        //console.log(props)
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            termList: [],
            subjectList: [],
            teachingAssignmentList: [],
            iconSize: '20px',
            searchCondition: {
            },
            perpage: 1000000,
            pagination: {
                currentPage: 1,
                lastPage: 1,
            },
            loading: true,
            term: 1,
            kind: "edit",
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            kind: this.props.location.state.kind
        })
        try {
            let [schoolYearList, classList, subjectList, teacher] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000),
                Api.getSubjectList(1, 1000000),
                Api.getTeacherByCode(this.context.user.userCode)
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                teacherId: teacher.data.result.teacherId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                classList: classList.data.result.data,
                subjectList: subjectList.data.result.data,
                searchCondition: searchCondition,
                teacherId: teacher.data.result.teacherId
            })
            await this.refresh(1, this.state.perpage, searchCondition)
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

    refresh = async (page, perpage, searchCondition) => {
        this.setState({ loading: true })
        try {
            let res = await Api.searchTeachingAssignment(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                loading: false,
                teachingAssignmentList: res.data.result.data,
                pagination: res.data.result.pagination,
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

    refreshClear() {
        let searchCondition = {
            schoolYearId: this.state.searchCondition.schoolYearId,
            teacherId: this.state.searchCondition.teacherId
        }
        this.setState({
            searchCondition: searchCondition
        })
        this.refresh(1, this.state.perpage, searchCondition)
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

    getSubjectOption = () => {
        let list = this.state.subjectList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { subjectId, subjectName } = list[i];
            options.push({
                name: subjectName,
                value: subjectId
            })
        }
        return options
    }

    getTermOptions = () => {
        return [{ name: "1", value: 1 }, { name: "2", value: 2 }]
    }

    changeSearchCondition = (name, value) => {
        console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        this.setState({ searchCondition: searchCondition })
    }

    renderTableData() {
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        return this.state.teachingAssignmentList.map((year, index) => {
            const { subjectName, className, schoolYear } = year;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{subjectName}</td>
                    <td>{className}</td>
                    <td>{schoolYear}</td>
                    <td>{this.state.term}</td>
                    {this.state.kind === "edit" &&
                        <td className="text-center">
                            <button className="btn btn-danger" onClick={() => this.inputScore(index)}>Nhập điểm</button>
                        </td>
                    }
                    { this.state.kind !== "edit" &&
                        <td className="text-center">
                            <button className="btn btn-danger" onClick={() => this.viewScore(index)}>Xem điểm</button>
                        </td>
                    }
                </tr>
            );
        });
    }

    inputScore = (index) => {
        this.props.history.push("/teaching-class-score", {
            term: this.state.term,
            ...this.state.teachingAssignmentList[index],
        })
    }

    viewScore = (index) => {
        this.props.history.push("/search-score", {
            term: this.state.term,
            ...this.state.teachingAssignmentList[index],
        })
    }

    closeDelete = () => {
        this.setState({ showDelete: false });
    }

    closeModal = () => {
        this.setState({ showModal: false });
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
                            Danh sách lớp dạy
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline">
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => { this.refreshClear() }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
                        </form>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline">
                            <label >Năm học:</label>
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
                            <label className="ml-2">Kỳ học</label>
                            <div className="ml-1 select-term">
                                <SelectSearch
                                    options={this.getTermOptions()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.term}
                                    onChange={v => this.setState({ term: v })}
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
                                />
                            </div>
                            <label className="ml-2">Môn học:</label>
                            <div className="ml-1 select-subject">
                                <SelectSearch
                                    options={this.getSubjectOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.subjectId}
                                    onChange={v => this.changeSearchCondition("subjectId", v)}
                                />
                            </div>
                            <button type="button" className="btn btn-primary btn-sm ml-auto" onClick={() => this.refresh()}>
                                <BiSearch size={this.state.iconSize} />Tìm kiếm
                            </button>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <div style={{ minHeight: "380px" }}>
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>Môn học</th>
                                        <th>Lớp</th>
                                        <th>Năm học</th>
                                        <th>Kỳ học</th>
                                        <th>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MyTeachingAssignment.contextType = AppContext

export default withRouter(MyTeachingAssignment);
