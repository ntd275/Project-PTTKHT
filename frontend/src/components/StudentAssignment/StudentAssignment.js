import React, { Component } from "react";
import Api from "../../api/api";
import { BiSearch, BiRefresh } from 'react-icons/bi';
import { IoIosAdd } from 'react-icons/io';
import { FaFileDownload, FaFileUpload } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import '../../css/StudentAssignment.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { withRouter } from 'react-router-dom'
import 'react-select-search/style.css'
import Pagination from '../Pagination/Pagination'
import Loading from '../Loading/Loading'
import { BsArrowLeftShort, BsTrash } from 'react-icons/bs'

class StudentAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            studentList: [],
            studentAssignmentList: [],
            iconSize: '20px',
            searchCondition: {

            },
            perpage: 10,
            pagination: {
                currentPage: 1,
                lastPage: 1,
            },
            loading: true,
            modalData: {
                classId: null,
                className: "",
                schoolYear: "",
                schoolYearId: null,
                studentCode: "",
                studentId: null,
                studentName: "",
                studentAssignmentId: 0,
            },
            showModal: false,
            modalKind: "",
            modalLoading: true,
            modalEdited: false,
            showDelete: false,
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, classList, studentList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000),
                Api.getStudentList(1, 1000000),
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                classId: classList.data.result.data[0].classId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                classList: classList.data.result.data,
                studentList: studentList.data.result.data,
                searchCondition: searchCondition
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
            let res = await Api.searchStudentAssignment(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                loading: false,
                studentAssignmentList: res.data.result.data,
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
            classId: this.state.searchCondition.classId
        }
        this.setState({
            searchCondition: searchCondition
        })
        this.refresh(1, this.state.perpage, searchCondition)
    }

    changePerPage = async (e) => {
        this.setState({ perpage: e.target.value })
        await this.refresh(this.state.pagination.currentPage, e.target.value)
    }
    changePage = async (page) => {
        await this.refresh(page, this.state.perpage)
    }

    getStudentOption = () => {
        let list = this.state.studentList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { studentId, studentName, studentCode } = list[i];
            options.push({
                name: studentName + " - " + studentCode,
                value: studentId
            })
        }
        return options
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

    changeSearchCondition = (name, value) => {
        console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        this.setState({ searchCondition: searchCondition })
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
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        return this.state.studentAssignmentList.map((data, index) => {
            const { studentCode, studentName, dateOfBirth, gender, address } = data;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{studentCode}</td>
                    <td>{studentName}</td>
                    <td>{this.formatDate(new Date(dateOfBirth))}</td>
                    <td>{gender === 1 ? "Nam" : "Nữ"}</td>
                    <td>{address}</td>
                    <td className="text-center"><BsTrash onClick={() => this.deleteStudentAssignment(index)} /></td>
                </tr>
            );
        });
    }

    addStudentAssignment = () => {
        this.setState({
            showModal: true,
            modalKind: "add",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                classId: this.state.searchCondition.classId,
                className: "",
                schoolYear: "",
                schoolYearId: this.state.searchCondition.schoolYearId,
                studentCode: "",
                studentId: null,
                studentName: "",
                studentAssignmentId: 0,
            }
        })
    }

    deleteStudentAssignment = (index) => {
        let studentAssignment = this.state.studentAssignmentList[index]
        this.setState({
            showDelete: true,
            modalData: {
                ...studentAssignment
            }
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
                <Dialog
                    show={this.state.showModal}
                    kind={this.state.modalKind}
                    close={this.closeModal}
                    data={this.state.modalData}
                    loading={this.state.modalLoading}
                    setData={(data) => this.setState({ modalData: data, modalEdited: true })}
                    edited={this.state.modalEdited}
                    refresh={this.refresh}
                    getSchoolYearOption={this.getSchoolYearOption}
                    getStudentOption={this.getStudentOption}
                    getClassOption={this.getClassOption}
                />
                <ConfirmDelete
                    show={this.state.showDelete}
                    close={this.closeDelete}
                    data={this.state.modalData}
                    refresh={this.refresh}
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Quản lý danh sách học sinh trong lớp
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => { this.refreshClear() }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={this.addStudentAssignment}>
                                <IoIosAdd size={this.state.iconSize} />Thêm học sinh vào lớp
                            </button>
                            <label className="ml-4">Số lượng bản ghi mỗi trang:</label>
                            <select className="form-control-sm ml-3" value={this.state.perpage} onChange={this.changePerPage} style={{ width: "70px" }}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
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
                            <label className="ml-2">Học sinh:</label>
                            <div className="ml-1 select-student">
                                <SelectSearch
                                    options={this.getStudentOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.studentId}
                                    onChange={v => this.changeSearchCondition("studentId", v)}
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
                                        <th>Mã số học sinh</th>
                                        <th>Họ tên</th>
                                        <th>Ngày sinh</th>
                                        <th>Giới tính</th>
                                        <th>Địa chỉ</th>
                                        <th>
                                            <BsTrash />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                        <Pagination pagination={this.state.pagination} changePage={this.changePage} />
                    </div>
                </div>
            </div>
        );
    }
}


class ConfirmDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    delete = async () => {
        this.setState({ loading: true })
        try {
            await Api.deleteStudentAssignment(this.props.data.studentAssignmentId)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Xóa phân học sinh khỏi lớp thành công`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.props.close()
            this.props.refresh()
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

    render() {
        return (
            <div>
                <Modal show={this.props.show} backdrop="static" keyboard={false} >
                    <Modal.Header>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {"Bạn chắc chắn muốn xóa học sinh "} <b> {this.props.data.studentName} </b> {" khỏi lớp ?"}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.close}>Hủy</Button>
                        <Button variant="danger" onClick={this.delete}>Xóa</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>

        )
    }
}

class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false,
            message: "Bạn có chắc chắn muốn thoát không ?",
            loading: false,
        }
    }

    getTitle = () => {
        if (this.props.kind === "add") {
            return "Thêm học sinh vào lớp"
        }
        if (this.props.kind === "edit") {
            return "Sửa phân công học sinh"
        }
        return "Thông tin phân công học sinh"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addStudentAssignment}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editTeachingAssignment}>Sửa</Button>
        }
        return null
    }

    addStudentAssignment = async () => {
        this.setState({ loading: true })
        try {
            await Api.addStudentAssignment(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Thêm phân học sinh vào lớp thành công`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.closeAll()
            this.props.refresh()
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.data.message.code === "ER_DUP_ENTRY") {
                store.addNotification({
                    title: "Thêm thất bại",
                    message: "Học sinh này đã được phân vào một lớp trong năm học này",
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

    close = () => {
        if (this.props.edited) {
            this.setState({
                showConfirm: true
            })
        } else {
            this.props.close()
        }
    }

    closeAll = () => {
        this.setState({ showConfirm: false })
        this.props.close()
    }

    changeHandler = (e) => {
        console.log(e)
        let name = e.target.name
        let value = e.target.value
        let data = this.props.data
        data[name] = value
        this.props.setData(data)
    }

    closeConfirm = () => {
        this.setState({
            showConfirm: false
        })
    }

    render() {
        //console.log(this.props)
        return (
            <div>
                <Modal size="lg" show={this.props.show} onHide={this.close} centered backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.getTitle()}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.loading && <div className="container-fluid d-flex justify-content-center" style={{ height: "300px" }}>
                            <div className="d-flex justify-content-center text-primary mt-auto mb-auto">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div >}

                        {!this.props.loading &&
                            <div className="container-fluid">
                                <div className="form-group">
                                    <label >Năm học</label>
                                    <div >
                                        <SelectSearch
                                            options={this.props.getSchoolYearOption()}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            onChange={v => { this.changeHandler({ target: { name: "schoolYearId", value: v } }) }}
                                            value={this.props.data.schoolYearId}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="ml-2">Lớp</label>
                                    <div>
                                        <SelectSearch
                                            options={this.props.getClassOption()}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            onChange={v => { this.changeHandler({ target: { name: "classId", value: v } }) }}
                                            value={this.props.data.classId}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label >Học sinh</label>
                                    <div>
                                        <SelectSearch
                                            options={this.props.getStudentOption()}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            onChange={v => { this.changeHandler({ target: { name: "studentId", value: v } }) }}
                                            value={this.props.data.studentId}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.close}>Hủy</Button>
                        {this.getButton()}
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showConfirm} backdrop="static" keyboard={false} >
                    <Modal.Header>
                        <Modal.Title>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {this.state.message}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeConfirm}>Hủy</Button>
                        <Button variant="danger" onClick={this.closeAll}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>
        )
    }
}

export default withRouter(StudentAssignment);
