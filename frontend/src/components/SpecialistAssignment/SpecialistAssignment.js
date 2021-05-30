import React, { Component } from "react";
import Api from "../../api/api";
import { BiSearch, BiRefresh } from 'react-icons/bi';
import { IoIosAdd } from 'react-icons/io';
import { Modal, Button } from 'react-bootstrap';
import '../../css/SpecialistAssignment.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { withRouter } from 'react-router-dom'
import 'react-select-search/style.css'
import Pagination from '../Pagination/Pagination'
import Loading from '../Loading/Loading'
import { BsArrowLeftShort, BsTrash } from 'react-icons/bs'


class SpecialistAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            termList: [],
            teacherList: [],
            specialistTeamList: [],
            specialistAssignmentList: [],
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
                subjectId: null,
                subjectName: "",
                teacherCode: "",
                teacherId: null,
                teacherName: "",
                teachingAssignmentId: 0,
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
            let [schoolYearList, classList, teacherList, specialistTeamList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000),
                Api.getTeacherList(1, 1000000),
                Api.getSpecialistTeamList(1, 1000000),
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                classList: classList.data.result.data,
                teacherList: teacherList.data.result.data,
                specialistTeamList: specialistTeamList.data.result.data,
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
            let res = await Api.searchSpecialistAssignment(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                loading: false,
                specialistAssignmentList: res.data.result.data,
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
            schoolYearId: this.state.searchCondition.schoolYearId
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

    getTeacherOption = () => {
        let list = this.state.teacherList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { teacherId, teacherName, teacherCode } = list[i];
            options.push({
                name: teacherName + " - " + teacherCode,
                value: teacherId
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

    getSpecialistTeamOption = () => {
        let list = this.state.specialistTeamList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { specialistTeamId, specialistName } = list[i];
            options.push({
                name: specialistName,
                value: specialistTeamId
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

    renderTableData() {
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        return this.state.specialistAssignmentList.map((data, index) => {
            const { teacherCode, teacherName, specialistName, schoolYear } = data;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{teacherCode}</td>
                    <td>{teacherName}</td>
                    <td>{specialistName}</td>
                    <td>{schoolYear}</td>
                    <td className="text-center"><BsTrash onClick={() => this.deleteSpecialistAssignment(index)} /></td>
                </tr>
            );
        });
    }

    addSpecialistAssignment = () => {
        this.setState({
            showModal: true,
            modalKind: "add",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                classId: null,
                className: "",
                schoolYear: "",
                schoolYearId: this.state.searchCondition.schoolYearId,
                specialistTeamId: this.state.searchCondition.specialistTeamId,
                specialistTeamName: "",
                teacherCode: "",
                teacherId: null,
                teacherName: "",
                teachingAssignmentId: 0,
            }
        })
    }

    deleteSpecialistAssignment = (index) => {
        let specialistAssignment = this.state.specialistAssignmentList[index]
        this.setState({
            showDelete: true,
            modalData: {
                ...specialistAssignment
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
                    getTeacherOption={this.getTeacherOption}
                    getClassOption={this.getClassOption}
                    getSpecialistTeamOption={this.getSpecialistTeamOption}
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
                            Quản lý phân công tổ chuyên môn
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => { this.refreshClear() }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
                            <button type="button" className="btn btn-primary btn-sm ml-3" onClick={this.addSpecialistAssignment}>
                                <IoIosAdd size={this.state.iconSize} color="" />Thêm phân công
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
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
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
                            <label className="ml-2">Giáo viên:</label>
                            <div className="ml-1 select-teacher">
                                <SelectSearch
                                    options={this.getTeacherOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.teacherId}
                                    onChange={v => this.changeSearchCondition("teacherId", v)}
                                />
                            </div>
                            <label className="ml-2">Tổ:</label>
                            <div className="ml-1 select-specialist-team">
                                <SelectSearch
                                    options={this.getSpecialistTeamOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.specialistTeamId}
                                    onChange={v => this.changeSearchCondition("specialistTeamId", v)}
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
                                        <th>Mã số giáo viên</th>
                                        <th>Họ tên</th>
                                        <th>Tổ</th>
                                        <th>Năm học</th>
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
            await Api.deleteSpecialistAssignment(this.props.data.specialistAssignmentId)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Xóa phân công tổ chuyên môn thành công`,
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
                            {"Bạn chắc chắn muốn phân công của giáo viên "} <b> {this.props.data.teacherName} </b> {" ?"}
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
            return "Thêm phân công tổ chuyên môn"
        }
        if (this.props.kind === "edit") {
            return "Sửa phân công tổ chuyên môn"
        }
        return "Thông tin phân công tổ chuyên môn"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addSpecialistAssignment}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editTeachingAssignment}>Sửa</Button>
        }
        return null
    }

    addSpecialistAssignment = async () => {
        this.setState({ loading: true })
        try {
            await Api.addSpecialistAssignment(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Thêm phân công tổ chuyên môn thành công`,
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
                                    <label >Giáo viên</label>
                                    <div>
                                        <SelectSearch
                                            options={this.props.getTeacherOption()}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            onChange={v => { this.changeHandler({ target: { name: "teacherId", value: v } }) }}
                                            value={this.props.data.teacherId}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="">Tổ chuyên môn</label>
                                    <div>
                                        <SelectSearch
                                            options={this.props.getSpecialistTeamOption()}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            onChange={v => { this.changeHandler({ target: { name: "specialistTeamId", value: v } }) }}
                                            value={this.props.data.specialistTeamId}
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

export default withRouter(SpecialistAssignment);
