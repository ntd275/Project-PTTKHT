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
                    title: "C???nh b??o",
                    message: "B???n kh??ng ???????c ph??n c??ng l??m GVCN n??m n??y",
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
                        term: searchCondition.term,
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
            console.log(conductList)

            this.setState({
                class: _class.data.result.data[0],
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
		searchCondition.classId = null
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

    conductName = ["T???t", "Kh??", "Trung b??nh", "Y???u"]

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
                    <td>{gender ? "Nam" : "N???"}</td>
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
                            C???p nh???t ????nh gi?? h???nh ki???m
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline">
                            <label>N??m h???c:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={this.getSchoolYearOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Kh??ng t??m th???y"
                                    placeholder=" "
                                    value={this.state.searchCondition.schoolYearId}
                                    onChange={v => this.changeSearchCondition("schoolYearId", v)}
                                />
                            </div>
                            <label className="ml-3">H???c k???:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={[{ name: "1", value: 1 }, { name: "2", value: 2 }]}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Kh??ng t??m th???y"
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
                                <b>Phi???u ????nh gi?? h???nh ki???m</b><br />
                            Tr?????ng Trung h???c c?? s??? ABC
                        </div>
                        </div>
                    </div>
                }
                {this.state.showList &&
                    <div className="row mt-3">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                            <span className="mr-5">
                                <b>N??m h???c: </b>{this.state.class.schoolYear}
                            </span>
                            <span className="mr-5">
                                <b>H???c k???: </b>{this.state.searchCondition.term}
                            </span>
                            <span className="mr-5">
                                <b>L???p: </b>{this.state.class.className}
                            </span>
                            <span className="mr-5">
                                <b>S?? s???: </b> {this.state.conductList.length}
                            </span>
                            <span className="mr-5">
                                <b>Gi??o vi??n ch??? nhi???m: </b>{this.state.teacher.teacherName}
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
                                        <th>H??? t??n</th>
                                        <th>Ng??y sinh</th>
                                        <th>Gi???i t??nh</th>
                                        <th>N??i sinh</th>
                                        <th>H???nh ki???m</th>
                                        <th>?? ki???n gi??o vi??n</th>
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
            message: "B???n c?? ch???c ch???n mu???n tho??t kh??ng ?",
            loading: false,
        }
    }

    getTitle = () => {
        if (this.props.kind === "add") {
            return "Th??m ????nh gi??"
        }
        if (this.props.kind === "edit") {
            return "C???p nh???t ????nh gi??"
        }
        return "Th??ng tin ????nh gi??"
    }

    getButton = () => {
        if (this.props.kind === "add") {
            return <Button onClick={this.addConduct}>Th??m</Button>
        }
        if (this.props.kind === "edit") {
            return <Button onClick={this.editConduct}>C???p nh???t</Button>
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
                title: "Th??nh c??ng",
                message: `C???p nh???t ????nh gi?? th??nh c??ng`,
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
                                        <Form.Label>H???nh ki???m</Form.Label>
                                        <SelectSearch
                                            options={[{ name: "T???t", value: 0 }, { name: "Kh??", value: 1 }, { name: "Trung b??nh", value: 2 }, { name: "Y???u", value: 3 }]}
                                            search
                                            filterOptions={fuzzySearch}
                                            emptyMessage="Kh??ng t??m th???y"
                                            placeholder=" "
                                            value={this.props.data.conduct}
                                            onChange={v => { this.changeHandler({ target: { name: "conduct", value: v } }) }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>?? ki???n gi??o vi??n</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nh???p ?? ki??n gi??o vi??n"
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

ConductAssessment.contextType = AppContext

export default withRouter(ConductAssessment);
