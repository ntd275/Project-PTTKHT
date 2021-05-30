import React, { Component } from "react";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi';
import { BiSearch, BiRefresh } from 'react-icons/bi';
import { Modal, Button } from 'react-bootstrap';
import '../../css/TeachingAssignment.css';
import { BsArrowLeftShort, BsTrash } from 'react-icons/bs'
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { withRouter } from 'react-router-dom'
import 'react-select-search/style.css'
import Loading from '../Loading/Loading'


class HomeroomTeacherAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            teacherList: [],
            homeroomTeacherAssignmentList: [],
            iconSize: '20px',
            searchCondition: {
            },
            perpage: 1000000,
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
                teacherCode: "",
                teacherId: null,
                teacherName: "",
                homeroomTeacherAssignmentId: 0,
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
            let [schoolYearList, classList, teacherList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000),
                Api.getTeacherList(1, 1000000),
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId
            }
            this.setState({
                schoolYearList: schoolYearList.data.result.data,
                classList: classList.data.result.data,
                teacherList: teacherList.data.result.data,
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
            let res = await Api.searchHomeroomTeacherAssignment(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchCondition || this.state.searchCondition)
            console.log(res)
            let data = res.data.result.data;
            if (!(this.state.searchCondition.classId || this.state.searchCondition.teacherId)) {
                let mark = {}
                for (let i = 0; i < data.length; i++) {
                    mark[data[i].classId] = 1
                }
                let classList = this.state.classList
                let schoolYear = this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId)
                for (let i = 0; i < classList.length; i++) {
                    if (!mark[classList[i].classId]) {
                        data.push({
                            ...classList[i],
                            ...schoolYear
                        })
                    }
                }
            }
            this.setState({
                loading: false,
                homeroomTeacherAssignmentList: data,
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

    changeSearchCondition = (name, value) => {
        console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        this.setState({ searchCondition: searchCondition })
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    renderTableData() {
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        return this.state.homeroomTeacherAssignmentList.map((year, index) => {
            const { teacherCode, teacherName, className, schoolYear } = year;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{className}</td>
                    <td>{teacherCode}</td>
                    <td>{teacherName ? teacherName : "Chưa phân công"}</td>
                    <td>{schoolYear}</td>
                    <td className="text-center">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.editHomeroomTeacherAssignment(index)}>
                            <FiEdit size={this.state.iconSize} />
                        </button></td>
                </tr>
            );
        });
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

    editHomeroomTeacherAssignment = (index) => {
        let homeroomTeacherAssignment = this.state.homeroomTeacherAssignmentList[index]
        this.setState({
            showModal: true,
            modalKind: "edit",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                ...homeroomTeacherAssignment
            }
        })
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
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Quản lý phân công giáo viên chủ nhiệm
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => { this.refreshClear() }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
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
                                        <th>Lớp</th>
                                        <th>Mã số giáo viên</th>
                                        <th>Họ tên</th>
                                        <th>Năm học</th>
                                        <th></th>
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
            return "Thêm phân công giáo viên chủ nhiệm"
        }
        if (this.props.kind === "edit") {
            return "Cập nhật phân công giáo viên chủ nhiệm"
        }
        return "Thông tin phân công giáo viên chủ nhiệm"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addHomeroomTeacherAssignment}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editHomeroomTeacherAssignment}>Cập nhật</Button>
        }
        return null
    }

    editHomeroomTeacherAssignment = async () => {
        this.setState({ loading: true })
        try {
            if (this.props.data.teacherId) {
                if (this.props.data.homeroomTeacherAssignmentId) {
                    await Api.editHomeroomTeacherAssignment(this.props.data)
                } else {
                    await Api.addHomeroomTeacherAssignment(this.props.data)
                }
            } else {
                if (this.props.data.homeroomTeacherAssignmentId) {
                    await Api.deleteHomeroomTeacherAssignment(this.props.data.homeroomTeacherAssignmentId)
                }
            }

            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Cập nhật giáo viên chủ nhiệm thành công`,
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
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label >Giáo viên</label>
                                    <div className="row">
                                        <div className="col-11">
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
                                        <div className="col d-flex">
                                            <BsTrash className="align-self-center" onClick={() => this.changeHandler({ target: { name: "teacherId", value: null } })} />
                                        </div>
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
                                            disabled={true}
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


export default withRouter(HomeroomTeacherAssignment);
