import React, { Component } from "react";
import Api from "../../api/api";
import { FiEdit } from 'react-icons/fi'
import { Modal, Form, Button } from 'react-bootstrap';
import '../../css/ConductAssessment.css';
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'

class ConductAssessment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            conductList: [],
            term: 0,
            iconSize: '20px',
            searchCondition: {},
            teacher: {},
            class: {},
            loading: true,
            modalData: {

            },
            showModal: false,
            modalKind: "",
            modalLoading: true,
            modalEdited: false,
            showList: false,
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
                term: 1,
                teacherId: teacher.data.result.teacherId
            }
            this.setState({
                teacher: teacher.data.result,
                schoolYearList: schoolYearList.data.result.data,
                searchCondition: searchCondition
            })
            await this.refresh(searchCondition)
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
        searchCondition = searchCondition || this.state.searchCondition
        //console.log(this.state)
        this.setState({ loading: true })
        try {
            let _class = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            if (_class.data.result.data.length === 0) {
                store.addNotification({
                    title: "Cảnh báo",
                    message: "Bạn không được phân công làm GVCN năm này",
                    type: "warning",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.setState({ loading: false, showList: false })
                return
            }

            searchCondition["classId"] = _class.data.result.data[0].classId

            let [res, studentList] = await Promise.all([
                Api.getClassConduct(searchCondition || this.state.searchCondition),
                Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            ])
            console.log(res, studentList)
            let conducts = res.data.result
            let conductList = studentList.data.result.data
            for (let i = 0; i < conductList.length; i++) {
                let conduct = conducts.find(e => e.studentId === conductList[i].studentId)
                if (conduct) {
                    conductList[i] = {
                        ...conductList[i],
                        conduct: conduct.conduct,
                        note: conduct.note,
                        teacherId: conduct.teacherId,
                        term: conduct.term,
                    }
                } else {
                    conductList[i] = {
                        ...conductList[i],
                        conduct: 5,
                        note: "",
                        teacherId: this.state.teacher.teacherId,
                        term: this.state.searchCondition.term,
                    }
                }
            }

            this.setState({
                loading: false,
                conductList: conductList,
                showList: true,
                searchCondition: this.state.searchCondition
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
        this.refresh(searchCondition)
    }

    formatDate = (d) => {
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yyyy = d.getFullYear()
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return dd + '/' + mm + '/' + yyyy
    }

    conductName = ["Tốt", "Khá", "Trung bình", "Yếu", "Kém"]

    renderTableData() {
        let sttBase = 1
        return this.state.conductList.map((data, index) => {
            const { studentCode, studentName, dateOfBirth, address, gender, conduct, note } = data;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{studentCode}</td>
                    <td>{studentName}</td>
                    <td>{this.formatDate(new Date(dateOfBirth))}</td>
                    <td>{gender ? "Name" : "Nữ"}</td>
                    <td>{address}</td>
                    <td>{this.conductName[conduct]}</td>
                    <td>{note}</td>
                    <td>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => this.editConduct(index)}>
                            <FiEdit size={this.state.iconSize} />
                        </button>
                    </td>
                </tr>
            );
        });
    }

    editConduct = (index) => {
        let conduct = this.state.conductList[index]
        this.setState({
            showModal: true,
            modalKind: "edit",
            modalLoading: false,
            modalEdited: false,
            modalData: {
                ...conduct
            }
        })
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
            <div className="container-fluid">
                <Dialog
                    show={this.state.showModal}
                    kind={this.state.modalKind}
                    close={this.closeModal}
                    data={this.state.modalData}
                    loading={this.state.modalLoading}
                    setData={(data) => this.setState({ modalData: data, modalEdited: true })}
                    edited={this.state.modalEdited}
                    refresh={this.refresh}
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Cập nhật đánh giá hạnh kiểm
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline">
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
                            <label className="ml-3">Học kỳ:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={[{ name: "1", value: 1 }, { name: "2", value: 2 }]}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.term}
                                    onChange={v => this.changeSearchCondition("term", v)}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <hr />
                {this.state.showList &&
                    <div className="row">
                        <div className="col-12 text-center conduct-title">
                            <div>
                                <b>Phiếu đánh giá hạnh kiểm</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                        </div>
                    </div>
                }
                {this.state.showList &&
                    <div className="row mt-3">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <span className="mr-5">
                                <b>Năm học: </b>{this.state.class.schoolYear}
                            </span>
                            <span className="mr-5">
                                <b>Học kỳ: </b>{this.state.searchCondition.term}
                            </span>
                            <span className="mr-5">
                                <b>Lớp: </b>{this.state.class.className}
                            </span>
                            <span className="mr-5">
                                <b>Sĩ số: </b> {this.state.conductList.length}
                            </span>
                            <span className="mr-5">
                                <b>Giáo viên chủ nhiệm: </b>{this.state.teacher.teacherName}
                            </span>
                        </div>
                    </div>
                }
                {this.state.showList &&
                    <div className="row mt-4">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>MSHS</th>
                                        <th>Họ tên</th>
                                        <th>Ngày sinh</th>
                                        <th>Giới tính</th>
                                        <th>Nơi sinh</th>
                                        <th>Hạnh kiểm</th>
                                        <th>Ý kiến giáo viên</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div >
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
            return "Thêm đánh giá"
        }
        if (this.props.kind === "edit") {
            return "Cập nhật đánh giá"
        }
        return "Thông tin đánh giá"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addConduct}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editConduct}>Cập nhật</Button>
        }
        return null
    }

    editConduct = async () => {
        this.setState({ loading: true })
        try {
            await Api.assessConduct(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: `Cập nhật đánh giá thành công`,
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
                                        <Form.Label>Hạnh kiểm</Form.Label>
                                        <SelectSearch
                                            options={[{ name: "Tốt", value: 0 }, { name: "Khá", value: 1 }, { name: "Trung bình", value: 2 }, { name: "Yếu", value: 3 }, { name: "Kém", value: 4 }]}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Không tìm thấy"
                                            placeholder=" "
                                            value={this.props.data.conduct}
                                            onChange={v => { this.changeHandler({ target: { name: "conduct", value: v } }) }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Ý kiến giáo viên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập ý kiên giáo viên"
                                            name="note"
                                            value={this.props.data.note}
                                            onChange={this.changeHandler}
                                            readOnly={this.props.kind === "info"}
                                        />
                                    </Form.Group>
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

ConductAssessment.contextType = AppContext

export default withRouter(ConductAssessment);
