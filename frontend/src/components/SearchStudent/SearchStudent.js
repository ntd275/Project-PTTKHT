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
                <th>M?? s??? h???c sinh</th>
                <th>H??? t??n</th>
                <th>Ng??y sinh</th>
                <th>Gi???i t??nh</th>
                <th>N??i sinh</th>
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
                    <td>{gender === 1 ? "Nam" : "N???"}</td>
                    <td>{address}</td>
                </tr>
            );
        });
    }

    showInfo = (index) => {
        let student = this.state.studentList[index]
        student.dateOfBirth = student.dateOfBirth && new Date(student.dateOfBirth)
        student.dateOfUnion = student.dateOfUnion && new Date(student.dateOfUnion)
        student.dateOfParty = student.dateOfParty && new Date(student.dateOfParty)
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
            placeholder: 'Nh???p t??n ho???c m?? h???c sinh',
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
                            Tra c???u th??ng tin h???c sinh
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
                        <BiSearch size={this.state.iconSize} />Tra c???u
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
            </div >
        );
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
            return "Th??m h???c sinh"
        }
        if (this.props.kind === "edit") {
            return "S???a h???c sinh"
        }
        return "Th??ng tin h???c sinh"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addStudent}>Th??m</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editStudent}>S???a</Button>
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
                                                <Form.Label>H??? t??n</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p h??? t??n h???c sinh"
                                                    name="studentName"
                                                    value={this.props.data.studentName}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>M?? h???c sinh</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p m?? h???c sinh"
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
                                                <Form.Label>Ng??y sinh</Form.Label>
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
                                                <Form.Label>S??? ??i???n tho???i</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p s??? ??i???n tho???i"
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
                                                <Form.Label>Gi???i t??nh</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="gender"
                                                    value={this.props.data.gender}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                >
                                                    <option value="1">Nam</option>
                                                    <option value="0">N???</option>
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
                                                    placeholder="Nh???p email"
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>???nh</Form.Label>
                                            </Form.Group>
                                            <img src={packagejson.proxy + "\\" + this.props.data.image} alt="avatar" style={{ width: "100%", height: "auto" }} />
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>H??? t??n b???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p h??? t??n b???"
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
                                                <Form.Label>S??? CMND</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p s??? CMND"
                                                    name="pId"
                                                    value={this.props.data.pId}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>S??? ??i???n tho???i b???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p s??? ??i???n tho???i b???"
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
                                                <Form.Label>H??? kh???u th?????ng tr??</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p h??? kh???u th?????ng tr??"
                                                    name="permanentResidence"
                                                    value={this.props.data.permanentResidence}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>Email b???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p email b???"
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
                                                <Form.Label>N??i ??? hi???n nay</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p n??i ??? hi???n nay"
                                                    name="address"
                                                    value={this.props.data.address}
                                                    onChange={this.changeHandler}
                                                    readOnly={this.props.kind === "info"}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group>
                                                <Form.Label>H??? t??n m???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p h??? t??n m???"
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
                                                <Form.Label>Ng??y v??o ??o??n</Form.Label>
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
                                                <Form.Label>S??? ??i???n tho???i m???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p s??? ??i???n tho???i m???"
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
                                                <Form.Label>Ng??y v??o ?????ng</Form.Label>
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
                                                <Form.Label>Email m???</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nh???p email m???"
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

export default withRouter(Student);
