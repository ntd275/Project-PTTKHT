import {
    BsArrowLeftShort,
} from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import React from "react";
import "../../css/SchoolYear.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import Api from '../../api/api'
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { withRouter } from 'react-router-dom'
import DatePicker from "react-datepicker";
import AppContext from '../../context/AppContext'
import SelectSearch, { fuzzySearch } from 'react-select-search';
class SearchHomeroomClassInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //state is by default an object
            studentList: [],
            perpage: 10,
            loading: true,
            modalData: {
                studentId: 0,
                studentCode: "",
                studentName: "",
                address: "",
                permanentResidence: "",
                gender: 1,
                pId: "",
                image: "http://localhost:3000/user.png",
                dateOfBirth: new Date(),
                email: "",
                phoneNumber: "",
                dateOfParty: new Date(),
                dateOfUnion: new Date(),
                accountName: "",
                fatherName: "",
                fatherPhone: "",
                fatherMail: "",
                motherName: "",
                motherPhone: "",
                motherMail: ""
            },
            showModal: false,
            modalKind: "",
            modalLoading: true,
            modalEdited: false,
            homeroomTeacher: {},
            schoolYearList: [],
            searchCondition: {},
            class: {},
        };
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            let [schoolYearList, teacher] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getTeacherByCode(this.context.user.userCode)
            ])
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                teacherId: teacher.data.result.teacherId,
            }
            let homeroomClass = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
            if (homeroomClass.data.result.data.length) {
                searchCondition.classId = homeroomClass.data.result.data[0].classId
            }
            this.setState({
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
            let res = await Api.searchStudentAssignment(1, 1000000, searchCondition || this.state.searchCondition)
            this.setState({ loading: false, studentList: res.data.result.data, showReport: true })

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
                    class: classList.data.result.data.length ? classList.data.result.data[0] : {},
                    searchCondition: searchCondition,
                })
                await this.refresh(searchCondition)
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

    renderTableHeader() {
        return (
            <tr>
                <th>STT</th>
                <th>Mã số học sinh</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Nơi sinh</th>
            </tr>
        )
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
        let sttBase = 1
        return this.state.studentList.map((year, index) => {
            const { studentCode, studentName, dateOfBirth, gender, address } = year;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{studentCode}</span></td>
                    <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{studentName}</span></td>
                    <td>{this.formatDate(new Date(dateOfBirth))}</td>
                    <td>{gender === 1 ? "Nam" : "Nữ"}</td>
                    <td>{address}</td>
                </tr>
            );
        });
    }

    showInfo = async (index) => {
        let studentId = this.state.studentList[index].studentId
        this.setState({
            showModal: true,
            modalKind: "info",
            modalLoading: true,
            modalEdited: false,
        })
        try {
            let student = await Api.getStudent(studentId)
            student = student.data.result
            student.dateOfBirth = new Date(student.dateOfBirth)
            student.dateOfUnion = new Date(student.dateOfUnion)
            student.dateOfParty = new Date(student.dateOfParty)
            this.setState({
                showModal: true,
                modalKind: "info",
                modalLoading: false,
                modalEdited: false,
                modalData: {
                    ...student
                }
            })
        } catch (err) {
            console.log(err)
            this.setState({
                showModal: false,
                modalKind: "info",
                modalLoading: false,
            })
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
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Xem thông tin lớp chủ nhiệm
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
                        </form>
                    </div>
                </div>
                <hr />
                {this.state.showReport &&
                    <div>
                        <div className="row mt-3">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                                <span className="mr-5 ml-5">
                                    <b>Lớp: </b> {this.state.class.className}
                                </span>
                                <span className="mr-5 ml-5">
                                    <b>Năm học: </b> {this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId) && this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId).schoolYear}
                                </span>
                                <span className="mr-5 ml-5">
                                    <b>Giáo viên chủ nhiệm: </b> {this.state.homeroomTeacher.teacherName}
                                </span>
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
            return "Thêm học sinh"
        }
        if (this.props.kind === "edit") {
            return "Sửa học sinh"
        }
        return "Thông tin học sinh"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addStudent}>Thêm</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editStudent}>Sửa</Button>
        }
        return null
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
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Họ tên</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập họ tên học sinh"
                                                    name="studentName"
                                                    value={this.props.data.studentName}

                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Mã học sinh</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập mã học sinh"
                                                    name="studentCode"
                                                    value={this.props.data.studentCode}

                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Ngày sinh</Form.Label>
                                                <div className="w-100">
                                                    <DatePicker
                                                        selected={this.props.data.dateOfBirth}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control w-100"
                                                        readOnly={this.props.kind === "info"}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập số điện thoại"
                                                    name="phoneNumber"
                                                    value={this.props.data.phoneNumber}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Giới tính</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="gender"
                                                    value={this.props.data.subjectName}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                >
                                                    <option value="1">Nam</option>
                                                    <option value="0">Nữ</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={this.props.data.email}
                                                    onChange={this.changeHandler}
                                                    placeholder="Nhập email"
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.File id="exampleFormControlFile1" label="Ảnh" disabled={this.props.kind === "info"} />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Họ tên bố</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập họ tên bố"
                                                    name="fatherName"
                                                    value={this.props.data.fatherName}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Số CMND</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập số CMND"
                                                    name="pId"
                                                    value={this.props.data.pId}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Số điện thoại bố</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập số điện thoại bố"
                                                    name="fatherPhone"
                                                    value={this.props.data.fatherPhone}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Hộ khẩu thường trú</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập hộ khẩu thường trú"
                                                    name="permanentResidence"
                                                    value={this.props.data.permanentResidence}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Email bố</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập email bố"
                                                    name="fatherMail"
                                                    value={this.props.data.fatherMail}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Nơi ở hiện nay</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập nơi ở hiện nay"
                                                    name="address"
                                                    value={this.props.data.address}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Họ tên mẹ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập họ tên mẹ"
                                                    name="motherName"
                                                    value={this.props.data.motherName}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Ngày vào Đoàn</Form.Label>
                                                <div className="w-100">
                                                    <DatePicker
                                                        selected={this.props.data.dateOfUnion}
                                                        onChange={value => this.changeHandler({ target: { name: "dateOfUnion", value: value } })}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control w-100"
                                                        readOnly={this.props.kind === "info"}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Số điện thoại mẹ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập số điện thoại mẹ"
                                                    name="motherPhone"
                                                    value={this.props.data.motherPhone}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Ngày vào Đảng</Form.Label>
                                                <div className="w-100">
                                                    <DatePicker
                                                        selected={this.props.data.dateOfParty}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control w-100"
                                                        readOnly={this.props.kind === "info"}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Email mẹ</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập email mẹ"
                                                    name="motherMail"
                                                    value={this.props.data.motherMail}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
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

SearchHomeroomClassInfo.contextType = AppContext
export default withRouter(SearchHomeroomClassInfo);
