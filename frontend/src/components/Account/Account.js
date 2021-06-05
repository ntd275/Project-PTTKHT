import {
    BsArrowLeftShort,
    BsArrowRepeat,
    BsTrash,
    BsSearch,
} from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import React from "react";
import "../../css/SchoolYear.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import Api from '../../api/api'
import Pagination from '../Pagination/Pagination'
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { withRouter } from 'react-router-dom'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import 'react-select-search/style.css'
class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //state is by default an object
            accountList: [],
            studentList: [],
            teacherList: [],
            perpage: 10,
            loading: true,
            pagination: {
                currentPage: 1,
                lastPage: 1,
            },
            modalData: {
                accountId: 0,
                accountName: "",
                role: 0,
                userCode: ""
            },
            showModal: false,
            modalKind: "",
            modalLoading: true,
            modalEdited: false,
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [teacherList, studentList] = await Promise.all([
                Api.getTeacherList(1, 1000000),
                Api.getStudentList(1, 1000000),
            ]);
            this.setState({
                teacherList: teacherList.data.result.data,
                studentList: studentList.data.result.data
            })
            await this.refresh(1, this.state.perpage)
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
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

    refresh = async (page, perpage) => {
        this.setState({ loading: true })
        try {
            let res = await Api.getAccountList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
            let accountList = res.data.result.data
            let teacherList = this.state.teacherList
            let studentList = this.state.studentList
            let map = {}
            for (let i = 0; i < teacherList.length; i++) {
                map[teacherList[i].teacherCode] = {
                    ...teacherList[i]
                }
            }
            for (let i = 0; i < studentList.length; i++) {
                map[studentList[i].studentCode] = {
                    ...studentList[i]
                }
            }
            for (let i = 0; i < accountList.length; i++) {
                accountList[i] = {
                    ...accountList[i],
                    ...map[accountList[i].userCode]
                }
            }
            console.log(accountList)
            this.setState({ loading: false, accountList: accountList, pagination: res.data.result.pagination })

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

    getTeacherOption = () => {
        let list = this.state.teacherList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { teacherName, teacherCode } = list[i];
            options.push({
                name: teacherName + " - " + teacherCode,
                value: teacherCode
            })
        }
        return options
    }

    getStudentOption = () => {
        let list = this.state.studentList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { studentName, studentCode } = list[i];
            options.push({
                name: studentName + " - " + studentCode,
                value: studentCode
            })
        }
        return options
    }

    changePerPage = async (e) => {
        this.setState({ perpage: e.target.value })
        await this.refresh(this.state.pagination.currentPage, e.target.value)
    }
    changePage = async (page) => {
        await this.refresh(page, this.state.perpage)
    }

    renderTableHeader() {
        return (
            <tr>
                <th>STT</th>
                <th>Tên tài khoản</th>
                <th>Họ tên</th>
                <th>Mã giáo viên/học sinh</th>
                <th>Loại tài khoản</th>
                <th className="text-center"><BsTrash /></th>
                <th className="text-center"><FaPencilAlt /></th>
            </tr>
        )
    }

    renderTableData() {
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        return this.state.accountList.map((data, index) => {
            const { accountName, studentName, role, teacherName, userCode } = data;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{accountName}</span></td>
                    <td>{role === 0 ? studentName : teacherName}</td>
                    <td>{userCode}</td>
                    <td>{role === 0 ? "Học sinh" : role === 1 ? "Giáo viên" : "Quản trị viên"}</td>
                    <td className="text-center"><BsTrash onClick={() => this.deleteAccount(index)} /></td>
                    <td className="text-center"><FaPencilAlt onClick={() => this.editAccount(index)} /></td>
                </tr>
            );
        });
    }

    addAccount = () => {
        this.setState({
            showModal: true,
            modalKind: "add",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                accountId: 0,
                accountName: "",
                role: 0,
                userCode: ""
            }
        })
    }

    editAccount = async (index) => {
        let account = this.state.accountList[index]
        this.setState({
            showModal: true,
            modalKind: "edit",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                ...account
            }
        })
    }

    deleteAccount = (index) => {
        let account = this.state.accountList[index]
        this.setState({
            showDelete: true,
            modalData: {
                ...account
            }
        })
    }

    showInfo = (index) => {
        let account = this.state.accountList[index]
        this.setState({
            showModal: true,
            modalKind: "info",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                ...account
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
                    getStudentOption={this.getStudentOption}
                    getTeacherOption={this.getTeacherOption}
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
                            Quản lý tài khoản
                        </div>
                    </div>
                </div>
                <br />
                <div className="d-flex">
                    <div>
                        <button type="button" className="btn btn-light" onClick={() => this.refresh()}>
                            <div className="d-flex">
                                <div>
                                    Tải lại trang
                                </div>
                                <div className="ml-2">
                                    <BsArrowRepeat />
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="ml-3">
                        <button type="button" className="btn btn-light" onClick={this.addAccount}>
                            <div className="d-flex">
                                <div>
                                    Thêm tài khoản
                                </div>
                                <div className="ml-2">
                                    <GoPlus />
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="d-flex ml-4">
                        <div className="align-self-center" >
                            Số lượng bản ghi mỗi trang:
                        </div>
                        <div className="align-self-center" >
                            <select className="form-control ml-3" value={this.state.perpage} onChange={this.changePerPage} style={{ width: "80px" }}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex ml-auto">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Tìm kiếm" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button"><BsSearch /></button>
                            </div>
                        </div>
                    </div>

                </div>
                <br></br>
                <div style={{ minHeight: "430px" }}>
                    <Table striped bordered hover >
                        <thead className="table-header">
                            {this.renderTableHeader()}
                        </thead>
                        <tbody>{this.renderTableData()}</tbody>
                    </Table>
                </div>
                <Pagination pagination={this.state.pagination} changePage={this.changePage} />
            </div >
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
            await Api.deleteAccount(this.props.data.accountId)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Xóa tài khoản thành công`,
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
                            {"Bạn chắc chắn muốn xóa tài khoản "} <b> {this.props.data.accountName} </b> {" ?"}
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
            return "Thêm tài khoản"
        }
        if (this.props.kind === "edit") {
            return "Sửa tài khoản"
        }
        return "Thông tin tài khoản"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addAccount}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editAccount}>Sửa</Button>
        }
        return null
    }

    addAccount = async () => {
        this.setState({ loading: true })
        try {
            await Api.addAccount(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Thêm tài khoản thành công`,
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
                    title: "Thêm tài khoản thất bại",
                    message: "Tên tài khoản đã sử dụng hoặc giáo viên/học sinh này đã có tài khoản",
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

    editAccount = async () => {
        this.setState({ loading: true })
        if (!this.props.data.password) {
            store.addNotification({
                title: "Cập nhật tài khoản thất bại",
                message: "Mật khẩu không được để trống",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.setState({ loading: false })
            return
        }
        try {
            await Api.editAccount(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Sửa tài khoản thành công`,
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
                    title: "Cập nhật tài khoản thất bại",
                    message: "Tên tài khoản đã sử dụng hoặc giáo viên/học sinh này đã có tài khoản",
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
        // console.log(e)
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
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Tên tài khoản</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên tài khoản"
                                            name="accountName"
                                            value={this.props.data.accountName}
                                            onChange={this.changeHandler}
                                            readOnly={this.props.kind === "info"}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            name="password"
                                            value={this.props.data.password}
                                            onChange={this.changeHandler}
                                            readOnly={this.props.kind === "info"}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Loại tài khoản</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="role"
                                            value={this.props.data.role}
                                            onChange={(e) => { this.changeHandler({ target: { name: "userCode", value: "" } }); this.changeHandler(e) }}
                                            readOnly={this.props.kind === "info"}
                                        >
                                            <option value={0}>Học sinh</option>
                                            <option value={1}>Giáo viên</option>
                                            <option value={2}>Quản trị viên</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <div className="form-group">
                                        <label >{this.props.data.role === 0 ? "Học sinh" : "Giáo viên"} </label>
                                        <div>
                                            <SelectSearch
                                                options={this.props.data.role === 0 ? this.props.getStudentOption() : this.props.getTeacherOption()}
                                                search
                                                filterOptions={fuzzySearch}
                                                emptyMessage="Không tìm thấy"
                                                placeholder=" "
                                                onChange={v => { this.changeHandler({ target: { name: "userCode", value: v } }) }}
                                                value={this.props.data.userCode}
                                                readOnly={this.props.kind === "info"}
                                            />
                                        </div>
                                    </div>

                                </Form>
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

export default withRouter(Account);
