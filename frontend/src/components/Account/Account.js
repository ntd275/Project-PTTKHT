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
            searchValue: "",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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

    refresh = async (page, perpage, searchValue) => {
        this.setState({ loading: true })
        try {
            let res
            if (searchValue || this.state.searchValue) {
                res = await Api.searchAccountByName(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchValue || this.state.searchValue)
            } else {
                res = await Api.getAccountList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
            }
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
                    title: "Th??ng b??o",
                    message: "Danh s??ch r???ng",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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
                <th>T??n t??i kho???n</th>
                <th>H??? t??n</th>
                <th>M?? gi??o vi??n/h???c sinh</th>
                <th>Lo???i t??i kho???n</th>
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
                    <td>{role === 0 ? "H???c sinh" : role === 1 ? "Gi??o vi??n" : "Qu???n tr??? vi??n"}</td>
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
                            Qu???n l?? t??i kho???n
                        </div>
                    </div>
                </div>
                <br />
                <div className="d-flex">
                    <div>
                        <button type="button" className="btn btn-light" onClick={() => this.refresh()}>
                            <div className="d-flex">
                                <div>
                                    T???i l???i trang
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
                                    Th??m t??i kho???n
                                </div>
                                <div className="ml-2">
                                    <GoPlus />
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="d-flex ml-4">
                        <div className="align-self-center" >
                            S??? l?????ng b???n ghi m???i trang:
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
                            <input type="text" className="form-control" placeholder="T??m ki???m" value={this.state.searchValue} onChange={e => this.setState({ searchValue: e.target.value })} />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={() => this.refresh(1)}><BsSearch /></button>
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
                title: "Th??nh c??ng",
                message: `X??a t??i kho???n th??nh c??ng`,
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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
                        <Modal.Title>X??c nh???n x??a</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {"B???n ch???c ch???n mu???n x??a t??i kho???n "} <b> {this.props.data.accountName} </b> {" ?"}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.close}>H???y</Button>
                        <Button variant="danger" onClick={this.delete}>X??a</Button>
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
            message: "B???n c?? ch???c ch???n mu???n tho??t kh??ng ?",
            loading: false,
        }
    }

    getTitle = () => {
        if (this.props.kind === "add") {
            return "Th??m t??i kho???n"
        }
        if (this.props.kind === "edit") {
            return "S???a t??i kho???n"
        }
        return "Th??ng tin t??i kho???n"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addAccount}>Th??m</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editAccount}>S???a</Button>
        }
        return null
    }

    validateData = () => {
        const isAccountName = /^[a-zA-Z0-9]+$/;
        if (this.props.data.accountName.length > 30) {
            store.addNotification({
                title: "Nh???p d??? li???u kh??ng ch??nh x??c",
                message: `T??n t??i kho???n kh??ng ???????c l???n h??n 30 k?? t???`,
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false;
        }
        if (!isAccountName.test(this.props.data.accountName)) {
            store.addNotification({
                title: "Nh???p d??? li???u kh??ng ch??nh x??c",
                message: `T??n t??i kho???n ch??? ch???a k?? t??? ch??? ho???c s???, kh??ng ???????c b??? tr???ng!`,
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false;
        }
        let password = this.props.data.password ? this.props.data.password.slice() : "";
        let isDigit = password.replace(/[^0-9]/g, "").length > 0 ? 1 : 0;
        let isLetter = password.replace(/[^a-zA-Z]/g, '').length > 0 ? 1 : 0;
        let isPunctuation = (password.length - password.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").length) > 0 ? 1 : 0;
        if (password.length < 8 || (isDigit + isLetter + isPunctuation < 2)) {
            store.addNotification({
                title: "L???i",
                message: "M???t kh???u kh??ng h???p l???! M???t kh???u ph???i d??i t???i thi???u 8 k?? t??? v?? ch???a 2 trong 3 lo???i ch???, s???, k?? t??? ?????c bi???t!",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false;
        }
        if (!this.props.data.userCode) {
            store.addNotification({
                title: "Nh???p d??? li???u kh??ng ch??nh x??c",
                message: `Ch??a ch???n H???c sinh ho???c Gi??o vi??n`,
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false;
        }
        return true;
    }

    addAccount = async () => {
        if (!this.validateData()) {
            return;
        }
        this.setState({ loading: true })
        try {
            await Api.addAccount(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Th??nh c??ng",
                message: `Th??m t??i kho???n th??nh c??ng`,
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
                    title: "Th??m t??i kho???n th???t b???i",
                    message: "T??n t??i kho???n ???? s??? d???ng ho???c gi??o vi??n/h???c sinh n??y ???? c?? t??i kho???n",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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
        if (!this.validateData()) {
            return;
        }
        this.setState({ loading: true })
        if (!this.props.data.password) {
            store.addNotification({
                title: "C???p nh???t t??i kho???n th???t b???i",
                message: "M???t kh???u kh??ng ???????c ????? tr???ng",
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
                title: "Th??nh c??ng",
                message: `S???a t??i kho???n th??nh c??ng`,
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
                    title: "C???p nh???t t??i kho???n th???t b???i",
                    message: "T??n t??i kho???n ???? s??? d???ng ho???c gi??o vi??n/h???c sinh n??y ???? c?? t??i kho???n",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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
                                        <Form.Label>T??n t??i kho???n</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nh???p t??n t??i kho???n"
                                            name="accountName"
                                            value={this.props.data.accountName}
                                            onChange={this.changeHandler}
                                            readOnly={this.props.kind === "info"}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>M???t kh???u</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nh???p m???t kh???u"
                                            name="password"
                                            value={this.props.data.password}
                                            onChange={this.changeHandler}
                                            readOnly={this.props.kind === "info"}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Lo???i t??i kho???n</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="role"
                                            value={this.props.data.role}
                                            onChange={(e) => { this.changeHandler({ target: { name: "userCode", value: "" } }); this.changeHandler(e) }}
                                            readOnly={this.props.kind === "info"}
                                        >
                                            <option value={0}>H???c sinh</option>
                                            <option value={1}>Gi??o vi??n</option>
                                            <option value={2}>Qu???n tr??? vi??n</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <div className="form-group">
                                        <label >{this.props.data.role === 0 ? "H???c sinh" : "Gi??o vi??n"} </label>
                                        <div>
                                            <SelectSearch
                                                options={this.props.data.role === 0 ? this.props.getStudentOption() : this.props.getTeacherOption()}
                                                search
                                                filterOptions={fuzzySearch}
                                                emptyMessage="Kh??ng t??m th???y"
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
                        <Button variant="secondary" onClick={this.close}>H???y</Button>
                        {this.getButton()}
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showConfirm} backdrop="static" keyboard={false} >
                    <Modal.Header>
                        <Modal.Title>X??c nh???n</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {this.state.message}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeConfirm}>H???y</Button>
                        <Button variant="danger" onClick={this.closeAll}>????ng</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>
        )
    }
}

export default withRouter(Account);
