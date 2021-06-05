import React, { Component } from "react";
import Api from "../../api/api";
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { withRouter } from 'react-router-dom'
import 'react-select-search/style.css'
import Loading from '../Loading/Loading'
import { BsArrowLeftShort } from 'react-icons/bs'


class TransferClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            newSchoolYearId: 0,
            classList: [],
            newClassId: 0,
            studentList: [],
            checkboxList: [],
            iconSize: '20px',
            searchCondition: {}
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, classList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000),
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                classId: classList.data.result.data[0].classId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                classList: classList.data.result.data,
                searchCondition: searchCondition,
                newSchoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                newClassId: classList.data.result.data[0].classId,
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

    back = () => {
        this.props.history.goBack()
    }

    refresh = async (searchCondition) => {
        this.setState({ loading: true })
        try {
            let res = await Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            console.log(res)
            let studentList = res.data.result.data;
            this.state.checkboxList.length = studentList.length
            this.state.checkboxList.fill(false)
            this.setState({
                loading: false,
                studentList: studentList,
                checkboxList: this.state.checkboxList
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

    formatDate = (d) => {
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yyyy = d.getFullYear()
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return dd + '/' + mm + '/' + yyyy
    }

    check = (index) => {
        let checkboxList = this.state.checkboxList
        checkboxList[index] = true
        this.setState({
            checkboxList: checkboxList
        })
    }

    uncheck = (index) => {
        let checkboxList = this.state.checkboxList
        checkboxList[index] = false
        this.setState({
            checkboxList: checkboxList
        })
    }

    checkAll = () => {
        let checkboxList = this.state.checkboxList
        checkboxList.fill(true)
        this.setState({
            checkboxList: checkboxList
        })
    }

    uncheckAll = () => {
        let checkboxList = this.state.checkboxList
        checkboxList.fill(false)
        this.setState({
            checkboxList: checkboxList
        })
    }

    renderTableData() {
        let sttBase = 1
        return this.state.studentList.map((data, index) => {
            const { studentCode, studentName, dateOfBirth, gender, address } = data;
            return (
                <tr key={index}>
                    <th>
                        <input
                            type="checkbox"
                            className="checkbox-assignment"
                            checked={this.state.checkboxList[index]}
                            onClick={() => this.state.checkboxList[index] ? this.uncheck(index) : this.check(index)}
                        />
                    </th>
                    <td>{sttBase + index}</td>
                    <td>{studentCode}</td>
                    <td>{studentName}</td>
                    <td>{this.formatDate(new Date(dateOfBirth))}</td>
                    <td>{gender === 1 ? "Nam" : "Nữ"}</td>
                    <td>{address}</td>
                </tr>
            );
        });
    }

    tranferClass = async () => {
        this.setState({ loadingModal: true })
        try {
            let studentList = this.state.studentList
            let checkboxList = this.state.checkboxList
            let list = []
            for (let i = 0; i < studentList.length; i++) {
                if (checkboxList[i]) {
                    list.push({
                        studentId: studentList[i].studentId,
                        classId: this.state.newClassId,
                        schoolYearId: this.state.newSchoolYearId
                    })
                }
            }
            if (list.length === 0) {
                this.setState({ loadingModal: false })
                return
            }
            await Api.tranferClass(list)
            store.addNotification({
                title: "Thành công",
                message: `Kết chuyển lớp thành công`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })

            this.setState({
                loadingModal: false
            })

        } catch (err) {
            console.log(err)
            this.setState({ loadingModal: false })
            if (err.response && err.response.data.message.code === "ER_DUP_ENTRY") {
                store.addNotification({
                    title: "Kết chuyển thất bại",
                    message: "Có học sinh trong danh sách chọn đã được phân vào một lớp trong kỳ kết chuyên lên",
                    type: "warning",
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
                <Loading show={this.state.loadingModal} />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Kết chuyển lớp
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label>Chọn lớp kết chuyển:</label>
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
                            <label className="ml-2" >Năm học:</label>
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
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={() => { this.refresh() }}>
                                OK
                            </button>
                        </form>
                    </div>
                </div>
                <hr />
                {this.state.studentList.length !== 0 &&
                    <div className="row mt-4">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                className="checkbox-assignment"
                                                checked={this.state.checkboxList.indexOf(false) === -1}
                                                onClick={() => this.state.checkboxList.indexOf(false) === -1 ? this.uncheckAll() : this.checkAll()}
                                            />
                                        </th>
                                        <th>STT</th>
                                        <th>Mã số học sinh</th>
                                        <th>Họ tên</th>
                                        <th>Ngày sinh</th>
                                        <th>Giới tính</th>
                                        <th>Địa chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                {this.state.studentList.length !== 0 &&
                    <div className="row mt-3">
                        <div className="col-12">
                            <form className="form-inline">
                                <label>Chọn lớp kết chuyển lên:</label>
                                <div className="ml-1 select-class">
                                    <SelectSearch
                                        options={this.getClassOption()}
                                        search
                                        filterOptions={fuzzySearch}
                                        emptyMessage="Không tìm thấy"
                                        placeholder=" "
                                        value={this.state.newClassId}
                                        onChange={v => this.setState({ newClassId: v })}
                                    />
                                </div>
                                <label className="ml-2" >Năm học:</label>
                                <div className="ml-1 select-school-year">
                                    <SelectSearch
                                        options={this.getSchoolYearOption()}
                                        search
                                        filterOptions={fuzzySearch}
                                        emptyMessage="Không tìm thấy"
                                        placeholder=" "
                                        value={this.state.newSchoolYearId}
                                        onChange={v => this.setState({ newSchoolYearId: v })}
                                    />
                                </div>
                                <button type="button" className="btn btn-primary btn-sm ml-3" onClick={() => { this.tranferClass() }}>
                                    Kết chuyển lên
                            </button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(TransferClass);
