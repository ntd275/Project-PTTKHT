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
        <th>N??m h???c</th>
        <th>M?? t???</th>
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
              Qu???n l?? danh m???c n??m h???c
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
            <button type="button" className="btn btn-light" onClick={this.addSchoolYear}>
              <div className="d-flex">
                <div>
                  Th??m n??m h???c
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
        title: "Th??nh c??ng",
        message: `X??a n??m h???c th??nh c??ng`,
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
          message: "N??m h???c n??y ???? c?? d??? li???u! ????? x??a tr?????c h???t c???n x??a h???t d??? li???u trong n??m h???c n??y",
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
              {"B???n ch???c ch???n mu???n x??a n??m h???c "}  <b>{this.props.data.schoolYear}</b>  {" ?"}
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
      return "Th??m n??m h???c"
    }
    if (this.props.kind === "edit") {
      return "S???a n??m h???c"
    }
    return "Th??ng tin n??m h???c"
  }

  getButton = () => {
    if (this.props.kind === "add") {
      return <Button onClick={this.addSchoolYear}>Th??m</Button>
    }
    if (this.props.kind === "edit") {
      return <Button onClick={this.editSchoolYear}>S???a</Button>
    }
    return null
  }
  validateData = () => {
    if (this.props.data.schoolYear.length > 15) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `T??n n??m h???c kh??ng ???????c l???n h??n 15 k?? t???`,
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
    if (this.props.data.schoolYear.length === 0) {
      store.addNotification({
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `T??n n??m h???c kh??ng ???????c b??? tr???ng!`,
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
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Ki???m tra ng??y K???t th??c k?? 1 ph???i l???n h??n ng??y B???t ?????u k?? 1!`,
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
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Ki???m tra ng??y B???t ?????u k?? 2 ph???i l???n h??n ng??y K???t th??c k?? 1!`,
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
        title: "Nh???p d??? li???u kh??ng ch??nh x??c",
        message: `Ki???m tra ng??y K???t th??c k?? 2 ph???i l???n h??n ng??y B???t ?????u k?? 2!`,
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
    if (!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.addSchoolYear(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Th??nh c??ng",
        message: `Th??m n??m h???c th??nh c??ng`,
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
          message: "N??m h???c ???? t???n t???i",
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

  editSchoolYear = async () => {
    if (!this.validateData()) {
      return;
    }
    this.setState({ loading: true })
    try {
      await Api.editSchoolYear(this.props.data)
      //console.log(res)
      this.setState({ loading: false })
      store.addNotification({
        title: "Th??nh c??ng",
        message: `S???a n??m h???c th??nh c??ng`,
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
          message: "N??m h???c ???? t???n t???i",
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
                    <Form.Label>N??m h???c</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nh???p n??m h???c"
                      name="schoolYear"
                      value={this.props.data.schoolYear}
                      onChange={this.changeHandler}
                      readOnly={this.props.kind === "info"}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      Th???i gian b???t ?????u k??? 1
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
                      Th???i gian k???t th??c k??? 1
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
                      Th???i gian b???t ?????u k??? 2
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
                      Th???i gian k???t th??c k??? 2
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
                      M?? t???
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Nh???p m?? t???"
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


export default withRouter(SchoolYear);
