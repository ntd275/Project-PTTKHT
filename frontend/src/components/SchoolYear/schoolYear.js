import {
  BsArrowLeftShort,
  BsArrowRepeat,
  BsTrash,
} from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import React from "react";
import "../../css/SchoolYear.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from '../../api/api'
import Pagination from '../Pagination/Pagination'
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { withRouter } from 'react-router-dom'
class SchoolYear extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //state is by default an object
      schoolYearList: [],
      perpage: 10,
      loading: true,
      pagination: {
        currentPage: 1,
        lastPage: 1,
      },
      modalData: {
        schoolYearId: 0,
        startFirstSemester: new Date(),
        finishFirstSemester: new Date(),
        startSecondSemester: new Date(),
        finishSecondSemester: new Date(),
        schoolYear: "",
        description: "",
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
      let res = await Api.getSchoolYearList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
      this.setState({ loading: false, schoolYearList: res.data.result.data, pagination: res.data.result.pagination })
      //console.log(res)
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
        <th>Năm học</th>
        <th>Mô tả</th>
        <th className="text-center"><BsTrash /></th>
        <th className="text-center"><FaPencilAlt /></th>
      </tr>
    )
  }

  renderTableData() {
    let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
    return this.state.schoolYearList.map((year, index) => {
      const { schoolYear, description } = year;
      return (
        <tr key={index}>
          <td>{sttBase + index}</td>
          <td><span className="text-primary" style={{ cursor: "pointer" }} onClick={() => this.showInfo(index)}>{schoolYear}</span></td>
          <td>{description}</td>
          <td className="text-center"><BsTrash onClick={() => this.deleteSchoolYear(index)} /></td>
          <td className="text-center"><FaPencilAlt onClick={() => this.editSchoolYear(index)} /></td>
        </tr>
      );
    });
  }

  addSchoolYear = () => {
    this.setState({
      showModal: true,
      modalKind: "add",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        startFirstSemester: new Date(),
        finishFirstSemester: new Date(),
        startSecondSemester: new Date(),
        finishSecondSemester: new Date(),
        schoolYear: "",
        description: "",
        schoolYearId: 0,
      }
    })
  }

  editSchoolYear = async (index) => {
    let schoolYear = this.state.schoolYearList[index]
    this.setState({
      showModal: true,
      modalKind: "edit",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        schoolYearId: schoolYear.schoolYearId,
        startFirstSemester: new Date(schoolYear.beginSemester1),
        finishFirstSemester: new Date(schoolYear.endSemester1),
        startSecondSemester: new Date(schoolYear.beginSemester2),
        finishSecondSemester: new Date(schoolYear.endSemester2),
        schoolYear: schoolYear.schoolYear,
        description: schoolYear.description,
      }
    })
  }

  deleteSchoolYear = (index) => {
    let schoolYear = this.state.schoolYearList[index]
    this.setState({
      showDelete: true,
      modalData: {
        schoolYearId: schoolYear.schoolYearId,
        startFirstSemester: new Date(schoolYear.beginSemester1),
        finishFirstSemester: new Date(schoolYear.endSemester1),
        startSecondSemester: new Date(schoolYear.beginSemester2),
        finishSecondSemester: new Date(schoolYear.endSemester2),
        schoolYear: schoolYear.schoolYear,
        description: schoolYear.description,
      }
    })
  }

  showInfo = (index) => {
    let schoolYear = this.state.schoolYearList[index]
    this.setState({
      showModal: true,
      modalKind: "info",
      modalLoading: false,
      modalEdited: false,
      modalData: {
        schoolYearId: schoolYear.schoolYearId,
        startFirstSemester: new Date(schoolYear.beginSemester1),
        finishFirstSemester: new Date(schoolYear.endSemester1),
        startSecondSemester: new Date(schoolYear.beginSemester2),
        finishSecondSemester: new Date(schoolYear.endSemester2),
        schoolYear: schoolYear.schoolYear,
        description: schoolYear.description,
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
              Quản lý danh mục năm học
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
            <button type="button" className="btn btn-light" onClick={this.addSchoolYear}>
              <div className="d-flex">
                <div>
                  Thêm năm học
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
      await Api.deleteSchoolYear(this.props.data.schoolYearId)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Xóa năm học thành công`,
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
              {"Bạn chắc chắn muốn xóa năm học "}  <b>{this.props.data.schoolYear}</b>  {" ?"}
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
      return "Thêm năm học"
    }
    if (this.props.kind === "edit") {
      return "Sửa năm học"
    }
    return "Thông tin năm học"
  }

  getButton = () => {
    if (this.props.kind === "add") {
      return <Button onClick={this.addSchoolYear}>Thêm</Button>
    }
    if (this.props.kind === "edit") {
      return <Button onClick={this.editSchoolYear}>Sửa</Button>
    }
    return null
  }
  validateData = () => {
    if (this.props.data.schoolYear.length == 0) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Tên năm học không được bỏ trống!`,
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
    if (this.props.data.finishFirstSemester <= this.props.data.startFirstSemester) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Kiểm tra ngày Kết thúc kì 1 phải lớn hơn ngày Bắt đầu kì 1!`,
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
    if (this.props.data.startSecondSemester <= this.props.data.finishFirstSemester) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Kiểm tra ngày Bắt đầu kì 2 phải lớn hơn ngày Kết thúc kì 1!`,
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
    if (this.props.data.finishSecondSemester <= this.props.data.startSecondSemester) {
      store.addNotification({
        title: "Nhập dữ liệu không chính xác",
        message: `Kiểm tra ngày Kết thúc kì 2 phải lớn hơn ngày Bắt đầu kì 2!`,
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
  addSchoolYear = async () => {
    if(!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.addSchoolYear(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Thêm năm học thành công`,
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

  editSchoolYear = async () => {
    if(!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.editSchoolYear(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Thành công",
        message: `Sửa năm học thành công`,
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
                    <Form.Label>Năm học</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập năm học"
                      name="schoolYear"
                      value={this.props.data.schoolYear}
                      onChange={this.changeHandler}
                      readOnly={this.props.kind === "info"}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Thời gian bắt đầu kỳ 1
              </Form.Label>
                    <div className="w-100">
                      <DatePicker
                        selected={this.props.data.startFirstSemester}
                        onChange={value => this.changeHandler({ target: { name: "startFirstSemester", value: value } })}
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-100"
                        readOnly={this.props.kind === "info"}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Thời gian kết thúc kỳ 1
              </Form.Label>
                    <div className="w-100">
                      <DatePicker
                        selected={this.props.data.finishFirstSemester}
                        onChange={value => this.changeHandler({ target: { name: "finishFirstSemester", value: value } })}
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-100"
                        readOnly={this.props.kind === "info"}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Thời gian bắt đầu kỳ 2
              </Form.Label>
                    <div className="w-100">
                      <DatePicker
                        selected={this.props.data.startSecondSemester}
                        onChange={value => this.changeHandler({ target: { name: "startSecondSemester", value: value } })}
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-100"
                        readOnly={this.props.kind === "info"}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Thời gian kết thúc kỳ 2
              </Form.Label>
                    <div className="w-100">
                      <DatePicker
                        selected={this.props.data.finishSecondSemester}
                        onChange={value => this.changeHandler({ target: { name: "finishSecondSemester", value: value } })}
                        dateFormat="dd/MM/yyyy"
                        className="form-control w-100"
                        readOnly={this.props.kind === "info"}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Mô tả
              </Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Nhập mô tả"
                      value={this.props.data.description}
                      name="description"
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


export default withRouter(SchoolYear);
