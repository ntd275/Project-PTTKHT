import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/StudentAttendance.css';
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { withRouter } from 'react-router-dom'
import DatePicker from "react-datepicker";
import AppContext from '../../context/AppContext'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { Modal, Button } from 'react-bootstrap'

class StudentAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            studentList: [],
            searchCondition: {
                beginDate: new Date(),
                endDate: new Date()
            },
            iconSize: '15px',
            edited: false,
            showReport: false,
            showLoading: false,
        };
    }

    async componentDidMount() {
        this.unblock = this.props.history.block(tx => {
            if (!this.state.edited) {
                this.unblock()
                return true
            } else {
                this.setState({
                    showConfirm: true,
                })
                return false
            }
        });
        this.setState({ loading: true })
        try {
            let [schoolYearList, teacher] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getTeacherByCode(this.context.user.userCode)
            ])
            let now = new Date()
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                teacherId: teacher.data.result.teacherId,
                beginDate: (new Date()).setDate(now.getDate() - 3),
                endDate: (new Date()).setDate(now.getDate() + 3)
            }
            let homeroomClass = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
            if (homeroomClass.data.result.data.length) {
                searchCondition.classId = homeroomClass.data.result.data[0].classId
            }
            this.setState({
                classList: homeroomClass.data.result.data,
                schoolYearList: schoolYearList.data.result.data,
                homeroomTeacher: teacher.data.result,
                searchCondition: searchCondition,
                class: homeroomClass.data.result.data.length ? homeroomClass.data.result.data[0] : {},
                loading: false
            })
            await this.refresh(searchCondition)
        } catch (err) {
            console.log(err)
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

    componentWillUnmount() {
        if (this.unblock) {
            this.unblock()
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
                this.setState({ loading: false, studentList: [] })
                return
            }
            let [res, studentList] = await Promise.all([
                Api.getClassAttendance(searchCondition || this.state.searchCondition),
                Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            ])
            studentList = this.processData(studentList.data.result.data, res.data.result)
            console.log(res, studentList)
            this.setState({
                loading: false,
                studentList: studentList,
                showReport: true,
                attendanceList: res.data.result
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

    getDateString = (date) => {
        let d = new Date(date)
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yyyy = d.getFullYear()
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return yyyy + "-" + mm + "-" + dd
    }

    processData = (studentList, attendanceList) => {
        let attendances = {}
        for (let i = 0; i < attendanceList.length; i++) {
            let attendance = attendanceList[i];
            if (!attendances[attendance.studentId]) {
                attendances[attendance.studentId] = {}
            }
            attendances[attendance.studentId][this.getDateString(attendance.date)] = attendance
        }
        for (let i = 0; i < studentList.length; i++) {
            let attendance = attendances[studentList[i].studentId] || {}
            studentList[i] = {
                attendance,
                ...studentList[i]
            }
        }
        return studentList
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
        if (name === "beginDate") {
            searchCondition.endDate = (new Date(value)).setDate(value.getDate() + 6)
        }
        if (name === "endDate") {
            searchCondition.beginDate = (new Date(value)).setDate(value.getDate() - 6)
        }
        if (name === "schoolYearId") {
            this.setState({ loading: true, showReport: false })
            searchCondition.classId = undefined;
            try {
                let classList = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
                if (classList.data.result.data.length) {
                    searchCondition.classId = classList.data.result.data[0].classId
                } else {
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
                }
                this.setState({
                    loading: false,
                    class: classList.data.result.data.length ? classList.data.result.data[0] : {},
                    classList: classList.data.result.data,
                    searchCondition: searchCondition,
                })
                return
            } catch (err) {
                this.setState({
                    loading: false,
                    classList: [],
                    searchCondition: searchCondition,
                })
                console.log(err)
            }
        }
        this.setState({ searchCondition: searchCondition, showReport: false })
    }

    renderTableHeader = () => {
        let tdList = [];
        tdList.push(<td key="stt">STT</td>)
        tdList.push(<td key="code">Mã HS</td>)
        tdList.push(<td key="name">Họ tên</td>)
        let i = new Date(this.state.searchCondition.beginDate)
        while (i <= this.state.searchCondition.endDate) {
            tdList.push(
                <td key={i.toString()}>{i.getDate() + "/" + (i.getMonth() + 1)}</td>
            )
            i.setDate(i.getDate() + 1);
        }
        return (
            <tr>
                {tdList}
            </tr>
        )
    }

    renderTableData = () => {
        let studentList = this.state.studentList;
        let trList = [];
        for (let i = 0; i < studentList.length; i++) {
            let tdList = [];
            let student = studentList[i];
            tdList.push(<td key={"stt" + i}>{i + 1}</td>)
            tdList.push(<td key={"code" + i}>{student.studentCode}</td>)
            tdList.push(<td key={"name" + i}>{student.studentName}</td>)
            let date = new Date(this.state.searchCondition.beginDate)
            let attendance = student.attendance
            let schoolYear = this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId)
            while (date <= this.state.searchCondition.endDate) {
                let key = this.getDateString(date)
                if (!attendance[key]) {
                    attendance[key] = {
                        schoolYearId: this.state.searchCondition.schoolYearId,
                        teacherId: this.state.searchCondition.teacherId,
                        date: key,
                        attendance: 2,
                        term: date <= schoolYear.endSemester1 ? 1 : 2
                    }
                }
                tdList.push(
                    <td key={date.toString() + i}>
                        <select
                            className="attendance-cell"
                            onChange={e => this.changeAttendance(attendance[key], e.target.value)}
                            value={attendance[key].attendance}
                        >
                            <option value="2"></option>
                            <option value="0">KP</option>
                            <option value="1">P</option>
                        </select>
                    </td>
                )
                date.setDate(date.getDate() + 1);
            }
            trList.push(
                <tr key={i}>
                    {tdList}
                </tr>
            )
        }
        return trList;
    }

    changeAttendance = (attendance, value) => {
        attendance.attendance = parseInt(value);
        attendance.edited = true;
        this.setState({ edited: true });
    }

    submit = async () => {
        this.setState({ showLoading: true })
        let list = [];
        let studentList = this.state.studentList;
        for (let i = 0; i < studentList.length; i++) {
            let element = {
                studentId: studentList[i].studentId,
                classId: this.state.searchCondition.classId,
                attendances: []
            }
            let attendance = studentList[i].attendance
            for (let date in attendance) {
                if (attendance[date].edited) {
                    if (!attendance[date].attendanceId) {
                        if (attendance[date].attendance !== 2) {
                            element.attendances.push({
                                ...attendance[date],
                                method: "add"
                            })
                        } else {
                            continue
                        }
                    } else {
                        if (attendance[date].attendance !== 2) {
                            element.attendances.push({
                                ...attendance[date],
                                method: "edit"
                            })
                        } else {
                            element.attendances.push({
                                ...attendance[date],
                                method: "delete",
                                attendance: 1,
                            })
                        }
                    }
                }
            }
            list.push(element)
        }
        try {
            if (this.state.edited) {
                await Api.updateAttendance({ students: list })
            }

            store.addNotification({
                title: "Thành công",
                message: "Cập nhật điểm danh thành công",
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.setState({ showLoading: false, edited: false })
            await this.refresh()
        } catch (err) {
            this.setState({ showLoading: false })
            console.log(err)
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

    closeConfirm = () => {
        this.setState({ showConfirm: false })
    }



    render() {
        // console.log(this.state.studentList)
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
                <Loading show={this.state.showLoading} />
                <Confirm
                    show={this.state.showConfirm}
                    close={this.closeConfirm}
                    unblock={this.unblock}
                    goBack={this.back}
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Điểm danh
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
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
                            <div className="ml-1 select-school-year">
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
                            <label className="ml-2">Từ ngày:</label>
                            <div style={{ width: "120px" }} className="ml-1">
                                <DatePicker
                                    selected={this.state.searchCondition.beginDate}
                                    onChange={v => this.changeSearchCondition("beginDate", v)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control w-100 text-center"
                                    readOnly={this.props.kind === "info"}
                                />
                            </div>
                            <label className="ml-2">Đến ngày:</label>
                            <div style={{ width: "120px" }} className="ml-1">
                                <DatePicker
                                    selected={this.state.searchCondition.endDate}
                                    onChange={v => this.changeSearchCondition("endDate", v)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control w-100 text-center"
                                    readOnly={this.props.kind === "info"}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary ml-auto" onClick={e => { e.preventDefault(); this.refresh() }}>Lấy danh sách</button>
                        </form>
                    </div>
                </div>
                <hr />
                {this.state.showReport &&
                    <div className="row mt-3">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    {this.renderTableHeader()}
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-primary" onClick={() => this.submit()}>
                                Lưu
                        </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.props.show} backdrop="static" keyboard={false} >
                    <Modal.Header>
                        <Modal.Title>Xác nhận thoát</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {"Bạn chắc chắn muốn thoát, các thay đổi sẽ không được lưu ?"}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.close}>Hủy</Button>
                        <Button variant="danger" onClick={() => { this.props.unblock(); this.props.goBack() }}>Thoát</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>

        )
    }
}

StudentAttendance.contextType = AppContext

export default withRouter(StudentAttendance);
