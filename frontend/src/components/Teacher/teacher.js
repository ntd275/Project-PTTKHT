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
class Teacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //state is by default an object
      teacherList: [],
      perpage: 10,
      loading: true,
      pagination: {
        currentPage: 1,
        lastPage: 1,
      },
      modalData: {
        teacherId: 0,
        teacherCode: "",
        teacherName: "",
        civilServantNumber: "",
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
        major: ""
      },
      showModal: false,
      modalKind: "",
      modalLoading: true,
      modalEdited: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true })
    await this.refresh(1, this.state.perpage)
  }

  back = () => {
    this.props.history.goBack()
  }

  refresh = async (page, perpage) => {
    this.setState({ loading: true })
    try {
      let res = await Api.getTeacherList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
      console.log(res)
      this.setState({ loading: false, teacherList: res.data.result.data, pagination: res.data.result.pagination })

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
        <th>Mã số giáo viên</th>
        <th>Họ tên</th>
        <th>Ngày sinh</th>
        <th>Giới tính</th>
        <th>Nơi sinh</th>
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
    return this.state.teacherList.map((year, index) => {
      const { teacherCode, teacherName, dateOfBirth, gender, address } = year;
      return (
        <tr key={index}>
          <td>{sttBase + index}</td>
          <td>{teacherCode}</td>
          <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{teacherName}</span></td>
          <td>{this.formatDate(new Date(dateOfBirth))}</td>
          <td>{gender === 1 ? "Nam" : "Nữ"}</td>
          <td>{address}</td>
          <td className="text-center"><BsTrash onClick={() => this.deleteTeacher(index)} /></td>
          <td className="text-center"><FaPencilAlt onClick={() => this.editTeacher(index)} /></td>
        </tr>
      );
    });
  }

  addTeacher = () => {
    this.setState({
      showModal: true,
      modalKind: "add",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        teacherId: 0,
        teacherCode: "",
        teacherName: "",
        civilServantNumber: "",
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
        major: ""
      }
    })
  }

  editTeacher = async (index) => {
    let teacher = this.state.teacherList[index]
    teacher.dateOfBirth = new Date(teacher.dateOfBirth)
    teacher.dateOfUnion = new Date(teacher.dateOfUnion)
    teacher.dateOfParty = new Date(teacher.dateOfParty)
    this.setState({
      showModal: true,
      modalKind: "edit",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        ...teacher
      }
    })
  }

  deleteTeacher = (index) => {
    let teacher = this.state.teacherList[index]
    teacher.dateOfBirth = new Date(teacher.dateOfBirth)
    teacher.dateOfUnion = new Date(teacher.dateOfUnion)
    teacher.dateOfParty = new Date(teacher.dateOfParty)
    this.setState({
      showDelete: true,
      modalData: {
        ...teacher
      }
    })
  }

  showInfo = (index) => {
    let teacher = this.state.teacherList[index]
    teacher.dateOfBirth = new Date(teacher.dateOfBirth)
    teacher.dateOfUnion = new Date(teacher.dateOfUnion)
    teacher.dateOfParty = new Date(teacher.dateOfParty)
    this.setState({
      showModal: true,
      modalKind: "info",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        ...teacher
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
              Quản lý danh mục giáo viên
          </div>
          </div>
        </div>
        <br />
        <div className="d-flex">
          <div>
            <button type="button" className="btn btn-light" onClick={this.refresh}>
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
            <button type="button" className="btn btn-light" onClick={this.addTeacher}>
              <div className="d-flex">
                <div>
                  Thêm giáo viên
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
      await Api.deleteTeacher(this.props.data.teacherId)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Xóa giáo viên thành công`,
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
              {"Bạn chắc chắn muốn xóa giáo viên "} <b> {this.props.data.studentName} </b> {" ?"}
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
      return "Thêm giáo viên"
    }
    if (this.props.kind === "edit") {
      return "Sửa giáo viên"
    }
    return "Thông tin giáo viên"
  }

  getButton = () => {
    if (this.props.kind === "add") {
      return <Button onClick={this.addTeacher}>Thêm</Button>
    }
    if (this.props.kind === "edit") {
      return <Button onClick={this.editTeacher}>Sửa</Button>
    }
    return null
  }
  
  validateData = () => {
    function removeAscent(str) {
      if (str === null || str === undefined) return str;
      str = str.toLowerCase();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      return str;
    }
    const isName = /^[a-zA-Z ]{2,}$/g
    const isPId = /[0-9]{9,12}/
    const isTeacherCode = /^[a-zA-Z0-9]+$/
    const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    const isEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (!isName.test(removeAscent(this.props.data.teacherName))) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Họ tên không hợp lệ!`,
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
        title: "Nhập dữ liệu không chính xác",
        message: `Số CMND phải bao gồm 9 đến 12 số`,
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
    if (!isTeacherCode.test(this.props.data.teacherCode)) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Mã giáo viên chứa kí tự chữ hoặc số, không được bỏ trống!`,
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
        title: "Nhập dữ liệu không chính xác",
        message: `Số điện thoại không hợp lệ!`,
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
    if (!isEmail.test(this.props.data.email) && this.props.data.email.length > 0) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Email không hợp lệ!`,
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

  addTeacher = async () => {
    //validate TODO
    if(!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.addTeacher(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Thêm giáo viên thành công`,
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

  editTeacher = async () => {
    if(!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.editTeacher(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Sửa giáo viên thành công`,
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
                  <div className="row">
                    <div className="col">
                      <Form.Group>
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập họ tên giáo viên"
                          name="teacherName"
                          value={this.props.data.teacherName}
                          onChange={this.changeHandler}
                          readOnly={this.props.kind === "info"}
                        />
                      </Form.Group>
                    </div>
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
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group>
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Control
                          as="select"
                          name="subjectName"
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
                        <Form.Label>Mã giáo viên</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập mã giáo viên"
                          name="teacherCode"
                          value={this.props.data.teacherCode}
                          onChange={this.changeHandler}
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
                        <Form.Label>Số hiệu công chức</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập số hiệu công chức"
                          name="civilServantNumber"
                          value={this.props.data.civilServantNumber}
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
                        <Form.Label>Chuyên môn</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập chuyên môn"
                          name="major"
                          value={this.props.data.major}
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

export default withRouter(Teacher);
