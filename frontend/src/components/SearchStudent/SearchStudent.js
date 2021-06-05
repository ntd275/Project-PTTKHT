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
import Pagination from '../Pagination/Pagination'
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { withRouter } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Autosuggest from 'react-autosuggest';
import { BiSearch } from 'react-icons/bi';
import packagejson from '../../../package.json';

class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //state is by default an object
            studentList: [],
            perpage: 10,
            loading: true,
            pagination: {
                currentPage: 1,
                lastPage: 1,
            },
            modalData: {
                studentId: 0,
                studentCode: "",
                studentName: "",
                address: "",
                permanentResidence: "",
                gender: 1,
                pId: "",
                image: "",
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
            suggestions: [],
            searchValue: "",
        };
    }

    async componentDidMount() {
        await this.refresh(1, this.state.perpage)
    }

    back = () => {
        this.props.history.goBack()
    }

    refresh = async (page, perpage, searchValue) => {
        this.setState({ loading: true })
        try {
            let res
            if (searchValue || this.state.searchValue) {
                res = await Api.searchStudentByName(page || this.state.pagination.currentPage, perpage || this.state.perpage, searchValue || this.state.searchValue)
            } else {
                res = await Api.getStudentList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
            }
            console.log(res)
            this.setState({ loading: false, studentList: res.data.result.data, pagination: res.data.result.pagination })

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
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
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

    showInfo = (index) => {
        let student = this.state.studentList[index]
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
    }


    closeModal = () => {
        this.setState({ showModal: false });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(async () => {
            let req = this.lastReq = Api.searchStudentByNameOrCode(1, this.state.perpage, value)
            try {
                let res = await req;
                if (req === this.lastReq) {
                    this.setState({
                        suggestions: res.data.result
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }, 200)
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onChangeSearch = (event, { newValue }) => {
        this.setState({
            searchValue: newValue
        });
    };

    getSuggestionValue = suggestion => suggestion.studentName;

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        this.refresh(null, null, suggestionValue)
    }

    renderSuggestion = (suggestion) => {
        return (
            <div className="w-100">{suggestion.studentName + " - " + suggestion.studentCode}</div>
        );
    }

    render() {
        const { searchValue, suggestions } = this.state;
        const theme = {
            container: 'autosuggest',
            input: 'form-control',
            suggestionsContainer: 'dropdown',
            suggestionsList: `dropdown-menu w-100 ${this.state.suggestions.length ? 'show' : ''}`,
            suggestion: 'dropdown-item w-100',
            suggestionFocused: 'active',
            suggestionHighlighted: 'active'
        };

        const inputProps = {
            placeholder: 'Nhập tên hoặc mã học sinh',
            value: searchValue,
            onChange: this.onChangeSearch
        }

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
                            Tra cứu thông tin học sinh
                        </div>
                    </div>
                </div>
                <br />
                <div className="d-flex">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                        theme={theme}
                        onSuggestionSelected={this.onSuggestionSelected}
                    />
                    <button type="button" className="btn btn-primary ml-3 align-self-center" onClick={() => this.refresh()}>
                        <BiSearch size={this.state.iconSize} />Tra cứu
                    </button>
                </div>
                <br></br>
                <div style={{ minHeight: "380px" }}>
                    <Table striped bordered hover >
                        <thead className="table-header">
                            {this.renderTableHeader()}
                        </thead>
                        <tbody>{this.renderTableData()}</tbody>
                    </Table>
                </div>

                <Pagination pagination={this.state.pagination} changePage={this.changePage} />
                <div className="d-flex mt-3">
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
                                                    onChange={this.changeHandler}
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
                                                    onChange={this.changeHandler}
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
                                                        onChange={value => this.changeHandler({ target: { name: "dateOfBirth", value: value } })}
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
                                                    value={this.props.data.gender}
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
                                                <Form.Label>Ảnh</Form.Label>
                                            </Form.Group>
                                            <img src={packagejson.proxy + "\\" + this.props.data.image} alt="avatar" style={{ width: "100%", height: "auto" }} />
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
                                                        onChange={value => this.changeHandler({ target: { name: "dateOfParty", value: value } })}
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
                                                    onChange={this.changeHandler}
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

export default withRouter(Student);
