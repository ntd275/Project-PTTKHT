import {
  BsArrowLeftShort,
  BsArrowRepeat,
  BsTrash,
  BsChevronRight,
  BsChevronLeft,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
} from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { Col, Row, Form } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt, FaRegCalendarAlt } from "react-icons/fa";
import React from "react";
import "../../css/Teacher.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
class Teacher extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      //state is by default an object
      dateOfUnion: new Date(),
      dateOfBirth: new Date(),
      dateOfParty: new Date(),
      teachers: [
        {
          stt: 1,
          teacherCode: "GV01",
          teacherName: "Đỗ Hồng Mai",
          dateOfBirth: "07/03/1999",
          gender: "Nữ",
          address: "Hải Dương",
          toDelete: <BsTrash />,
          toAdd: <FaPencilAlt />,
        },
        {
          stt: 2,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 3,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 4,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 5,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 6,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 7,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 8,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 9,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 10,
          teacherCode: "",
          teacherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
      ],
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleDateOfUnionChange = this.handleDateOfUnionChange.bind(this);
    this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
    this.handleDateOfPartyChange = this.handleDateOfPartyChange.bind(this);
  }
  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }
  handleDateOfUnionChange(date) {
    this.setState({
        dateOfUnion: date,
    });
  }
  handleDateOfBirthChange(date) {
    this.setState({
        dateOfBirth: date,
    });
  }
  handleDateOfPartyChange(date) {
    this.setState({
        dateOfParty: date,
    });
  }

  renderTableData() {
    return this.state.teachers.map((teacher, index) => {
      const {
        stt,
        teacherCode,
        teacherName,
        dateOfBirth,
        gender,
        address,
        toDelete,
        toAdd,
      } = teacher;
      return (
        <tr key={stt}>
          <td>{stt}</td>
          <td>{teacherCode}</td>
          <td>{teacherName}</td>
          <td>{dateOfBirth}</td>
          <td>{gender}</td>
          <td>{address}</td>
          <td>{toDelete}</td>
          <td>{toAdd}</td>
        </tr>
      );
    });
  }
  renderTableHeader() {
    let header = Object.keys(this.state.teachers[0]);
    return header.map((key, index) => {
      if (key === "stt") return <th key={index}>STT</th>;
      if (key === "teacherCode") return <th key={index}>Mã số giáo viên</th>;
      if (key === "teacherName") return <th key={index}>Họ tên</th>;
      if (key === "dateOfBirth") return <th key={index}>Ngày sinh</th>;
      if (key === "gender") return <th key={index}>Giới tính</th>;
      if (key === "address") return <th key={index}>Nơi sinh</th>;
      if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
      if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
      return <th key={index}>{key}</th>;
    });
  }

  render() {
    const { teachers } = this.state;
    let buttons = Object.keys(teachers);
    let values = buttons.map((key) => teachers[key].stt);
    const array = [
      <BsChevronDoubleLeft />,
      <BsChevronLeft />,
      ...values,
      <BsChevronRight />,
      <BsChevronDoubleRight />,
    ];
    this.getButtons = () => {
      return array.map((number, index) => {
        return (
          <Button variant="light" key={index}>
            {number}
          </Button>
        );
      });
    };

    return (
      <div className="Teacher">
        <Modal
          size="xl"
          show={this.state.showModal}
          onHide={this.close}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Thêm giáo viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Col>
                  <Form.Group controlId="teacherName">
                    <Form.Label>Họ Tên</Form.Label>
                    <Form.Control type="text" placeholder="Họ Tên" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="dateOfUnion">
                    <Form.Label>Ngày vào Đoàn</Form.Label>
                    <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                    <div className="form-group">
                      <DatePicker
                        selected={this.state.dateOfUnion}
                        onChange={this.handleDateOfUnionChange}
                        name="dateOfUnion"
                        dateFormat="MM/dd/yyyy"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="dateOfBirth">
                    <Form.Label>Ngày sinh</Form.Label>
                    <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                    <div className="form-group">
                      <DatePicker
                        selected={this.state.dateOfBirth}
                        onChange={this.handleDateOfBirthChange}
                        name="dateOfBirth"
                        dateFormat="MM/dd/yyyy"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="dateOfParty">
                    <Form.Label>Ngày vào Đảng</Form.Label>
                    <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                    <div className="form-group">
                      <DatePicker
                        selected={this.state.dateOfParty}
                        onChange={this.handleDateOfPartyChange}
                        name="dateOfParty"
                        dateFormat="MM/dd/yyyy"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="gender">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Control type="text" placeholder="Giới tính" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="teacherCode">
                    <Form.Label>Mã giáo viên </Form.Label>
                    <Form.Control type="text" placeholder="Mã giáo viên" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.File id="image" label="Ảnh" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="phoneNumBer">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control type="text" placeholder="Số điện thoại" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="pID">
                    <Form.Label>Số CMND</Form.Label>
                    <Form.Control type="text" placeholder="Số CMND" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Email" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="permanentResidence">
                    <Form.Label>Hộ khẩu thường trú</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Hộ khẩu thường trú"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="civilServantNumber">
                    <Form.Label>Số hiệu công chức</Form.Label>
                    <Form.Control type="text" placeholder="Số hiệu công chức" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="address">
                    <Form.Label>Nơi ở hiện nay</Form.Label>
                    <Form.Control type="text" placeholder="Nơi ở hiện nay" />
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Thêm</Button>
          </Modal.Footer>
        </Modal>
        <div>
          <Button className="back" variant="dark">
            <BsArrowLeftShort size={50} />
          </Button>
          <text> Quản lý danh mục giáo viên</text>
        </div>
        <br></br>
        <div className="btn-toolbar">
          <Button className="button" variant="light">
            Tải lại trang
            <BsArrowRepeat className="reload-icon" size={20} />
          </Button>
          <Button onClick={this.open} className="button" variant="light">
            Thêm giáo viên
            <GoPlus className="reload-icon" size={20} />
          </Button>
          <p className="text">
            <text style={{ marginRight: 10 }}>Số lượng bản ghi mỗi trang</text>
            <input name="numrecord" size={1}></input>
            <input
              name="search"
              placeholder="Tìm kiếm"
              style={{ marginLeft: 800, width: 200 }}
            ></input>
          </p>
        </div>
        <br></br>
        <Table striped bordered hover>
          <thead>{this.renderTableHeader()}</thead>
          <tbody>{this.renderTableData()}</tbody>
        </Table>
        <div className="page-button">{this.getButtons()}</div>
      </div>
    );
  }
}
export default Teacher;
