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
import DatePicker from "react-datepicker";
import ImageUploader from 'react-images-upload';
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
        image: "public/images/default_avatar.jpg",
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
        <th className="text-center"><BsTrash /></th>
        <th className="text-center"><FaPencilAlt /></th>
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
          <td>{studentCode}</td>
          <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{studentName}</span></td>
          <td>{this.formatDate(new Date(dateOfBirth))}</td>
          <td>{gender === 1 ? "Nam" : "N???"}</td>
          <td>{address}</td>
          <td className="text-center"><BsTrash onClick={() => this.deleteStudent(index)} /></td>
          <td className="text-center"><FaPencilAlt onClick={() => this.editStudent(index)} /></td>
        </tr>
      );
    });
  }

  addStudent = () => {
    this.setState({
      showModal: true,
      modalKind: "add",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        studentId: 0,
        studentCode: "",
        studentName: "",
        address: "",
        permanentResidence: "",
        gender: 1,
        pId: "",
        image: "/public/images/default_avatar.jpg",
        dateOfBirth: new Date(),
        email: "",
        phoneNumber: "",
        dateOfParty: null,
        dateOfUnion: null,
        accountName: "",
        fatherName: "",
        fatherPhone: "",
        fatherMail: "",
        motherName: "",
        motherPhone: "",
        motherMail: ""
      }
    })
  }

  editStudent = async (index) => {
    let student = this.state.studentList[index]
    student.dateOfBirth = student.dateOfBirth && new Date(student.dateOfBirth)
    student.dateOfUnion = student.dateOfUnion && new Date(student.dateOfUnion)
    student.dateOfParty = student.dateOfParty && new Date(student.dateOfParty)
    this.setState({
      showModal: true,
      modalKind: "edit",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        ...student
      }
    })
  }

  deleteStudent = (index) => {
    let student = this.state.studentList[index]
    student.dateOfBirth = student.dateOfBirth && new Date(student.dateOfBirth)
    student.dateOfUnion = student.dateOfUnion && new Date(student.dateOfUnion)
    student.dateOfParty = student.dateOfParty && new Date(student.dateOfParty)
    this.setState({
      showDelete: true,
      modalData: {
        ...student
      }
    })
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
              Qu???n l?? danh m???c h???c sinh
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
            <button type="button" className="btn btn-light" onClick={this.addStudent}>
              <div className="d-flex">
                <div>
                  Th??m h???c sinh
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
      await Api.deleteStudent(this.props.data.studentId)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Th??nh c??ng",
        message: `X??a h???c sinh th??nh c??ng`,
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
      if (err.response && err.response.data.message.code === "ER_ROW_IS_REFERENCED_2") {
        store.addNotification({
          title: "Kh??ng th??? x??a",
          message: "H???c sinh n??y ???? c?? d??? li???u! ????? x??a tr?????c h???t c???n x??a h???t d??? li???u li??n quan ?????n h???c sinh n??y",
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

  render() {
    return (
      <div>
        <Modal show={this.props.show} backdrop="static" keyboard={false} >
          <Modal.Header>
            <Modal.Title>X??c nh???n x??a</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              {"B???n ch???c ch???n mu???n x??a h???c sinh "} <b> {this.props.data.studentName} </b> {" ?"}
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
  validateData = () => {
    function removeAscent(str) {
      if (str === null || str === undefined) return str;
      str = str.toLowerCase();
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
      str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
      str = str.replace(/??|??|???|???|??/g, "i");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
      str = str.replace(/???|??|???|???|???/g, "y");
      str = str.replace(/??/g, "d");
      return str;
    }
    const isName = /^[a-zA-Z ]{2,}$/
    const isPId = /[0-9]{9,12}/
    const isCode = /^[a-zA-Z0-9]+$/
    const isVNPhoneMobile = /[0-9]{1,10}/
    const isEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (this.props.data.studentName.length > 30) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `T??n h???c sinh kh??ng ???????c l???n h??n 30 k?? t???`,
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
    if (!isName.test(removeAscent(this.props.data.studentName))) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `H??? t??n h???c sinh kh??ng h???p l???!`,
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
    if (!isPId.test(this.props.data.pId) && this.props.data.pId.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `S??? CMND ph???i bao g???m 9 ?????n 12 s???`,
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
    if (this.props.data.studentCode.length > 10) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `M?? h???c sinh kh??ng ???????c l???n h??n 10 k?? t???`,
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
    if (!isCode.test(this.props.data.studentCode)) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `M?? h???c sinh ch??? ch???a k?? t??? ch??? ho???c s???, kh??ng ???????c b??? tr???ng!`,
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
    if (!isVNPhoneMobile.test(this.props.data.phoneNumber) && this.props.data.phoneNumber.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `S??? ??i???n tho???i h???c sinh kh??ng h???p l???! Ch??? bao g???m s???, t???i ??a 10 ch??? s???`,
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
    if (!isEmail.test(this.props.data.email)) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Ki???m tra email h???p l??? v?? kh??ng ???????c b??? tr???ng!`,
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
    if (this.props.data.fatherName.length > 30) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `H??? t??n b??? kh??ng ???????c l???n h??n 30 k?? t???`,
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
    if (!isName.test(removeAscent(this.props.data.fatherName)) && this.props.data.fatherName.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `H??? t??n b??? kh??ng h???p l???!`,
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
    if (!isVNPhoneMobile.test(this.props.data.fatherPhone) && this.props.data.fatherPhone.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `S??? ??i???n tho???i b??? kh??ng h???p l???! Ch??? bao g???m s???, t???i ??a 10 ch??? s???`,
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
    if (!isEmail.test(this.props.data.fatherMail) && this.props.data.fatherMail.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Email b??? kh??ng h???p l???!`,
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
    if (this.props.data.motherName.length > 30) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `H??? t??n m??? kh??ng ???????c l???n h??n 30 k?? t???`,
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
    if (!isName.test(removeAscent(this.props.data.motherName)) && this.props.data.motherName.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `H??? t??n m??? kh??ng h???p l???!`,
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
    if (!isVNPhoneMobile.test(this.props.data.motherPhone) && this.props.data.motherPhone.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `S??? ??i???n tho???i m??? kh??ng h???p l???! Ch??? bao g???m s???, t???i ??a 10 ch??? s???`,
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
    if (!isEmail.test(this.props.data.motherMail) && this.props.data.motherMail.length > 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Email m??? kh??ng h???p l???!`,
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
  addStudent = async () => {
    if (!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      if (this.props.data.image[0] instanceof File) {
        let res = await Api.uploadImage(this.props.data.image[0])
        this.props.data.image = res.data.result
      }
      await Api.addStudent(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Th??nh c??ng",
        message: `Th??m h???c sinh th??nh c??ng`,
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
          title: "Th??m th???t b???i",
          message: "M?? h???c sinh/Email ???? ???????c s??? d???ng",
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

  editStudent = async () => {
    if (!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      if (this.props.data.image[0] instanceof File) {
        let res = await Api.uploadImage(this.props.data.image[0])
        this.props.data.image = res.data.result
      }
      await Api.editStudent(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Th??nh c??ng",
        message: `S???a h???c sinh th??nh c??ng`,
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
          title: "S???a th???t b???i",
          message: "M?? h???c sinh ???? ???????c s??? d???ng vui l??ng ch???n m?? kh??c",
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
                      {this.props.kind === "info" ?
                        <img src={packagejson.proxy + "\\" + this.props.data.image} alt="avatar" style={{ width: "100%", height: "auto" }} /> :
                        <ImageUploader
                          withIcon={true}
                          buttonText='Choose images'
                          onChange={(pic) => this.changeHandler({ target: { name: "image", value: pic } })}
                          imgExtension={['.jpg', '.gif', '.png', '.gif', 'jpeg']}
                          maxFileSize={5242880}
                          singleImage={true}
                          withPreview={true}
                        />
                      }
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
