import {
  BsArrowLeftShort,
  BsArrowRepeat,
  BsTrash,
  BsChevronRight,
  BsChevronLeft,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
} from "react-icons/bs";
import Dialog from "react-bootstrap-dialog";
import { AiOutlineSearch } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import { Col, Row, Form } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import React from "react";
import "../../css/Student.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
class Student extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      //state is by default an object
      students: [
        {
          stt: 1,
          studentCode: "HS01",
          studentName: "Tiến Anh",
          dateOfBirth: "09/09/1999",
          gender: "Nam",
          address: "Hà Nam",
          toDelete: <BsTrash />,
          toAdd: <FaPencilAlt />,
        },
        {
          stt: 2,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 3,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 4,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 5,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 6,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 7,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 8,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 9,
          studentCode: "",
          studentName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 10,
          studentCode: "",
          studentName: "",
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
  }
  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  renderTableData() {
    return this.state.students.map((student, index) => {
      const {
        stt,
        studentCode,
        studentName,
        dateOfBirth,
        gender,
        address,
        toDelete,
        toAdd,
      } = student;
      return (
        <tr key={stt}>
          <td>{stt}</td>
          <td>{studentCode}</td>
          <td>{studentName}</td>
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
    let header = Object.keys(this.state.students[0]);
    return header.map((key, index) => {
      if (key === "stt") return <th key={index}>STT</th>;
      if (key === "studentCode") return <th key={index}>Mã số học sinh</th>;
      if (key === "studentName") return <th key={index}>Họ tên</th>;
      if (key === "dateOfBirth") return <th key={index}>Ngày sinh</th>;
      if (key === "gender") return <th key={index}>Giới tính</th>;
      if (key === "address") return <th key={index}>Nơi sinh</th>;
      if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
      if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
      return <th key={index}>{key}</th>;
    });
  }

  render() {
    const { students } = this.state;
    let buttons = Object.keys(students);
    let values = buttons.map((key) => students[key].stt);
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
      <div className="Student">
        <Modal
          size="xl"
          show={this.state.showModal}
          onHide={this.close}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Thêm lớp học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Col>
                  <Form.Group controlId="studentName">
                    <Form.Label>Họ Tên</Form.Label>
                    <Form.Control type="studentName" placeholder="Họ Tên" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="studentCode">
                    <Form.Label>Mã học sinh</Form.Label>
                    <Form.Control
                      type="studentCode"
                      placeholder="Mã học sinh"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="dateOfBirth">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control type="dateOfBirth" placeholder="Ngày sinh" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="phoneNumBer">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="phoneNumBer"
                      placeholder="Số điện thoại"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="gender">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Control type="gender" placeholder="Giới tính" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" />
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
                  <Form.Group controlId="fartherName">
                    <Form.Label>Họ tên bố</Form.Label>
                    <Form.Control type="fartherName" placeholder="Họ tên bố" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="pID">
                    <Form.Label>Số CMND</Form.Label>
                    <Form.Control type="pID" placeholder="Số CMND" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="fartherPhone">
                    <Form.Label>Số điện thoại bố</Form.Label>
                    <Form.Control
                      type="fartherPhone"
                      placeholder="Số điện thoại bố"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="permanentResidence">
                    <Form.Label>Hộ khẩu thường trú</Form.Label>
                    <Form.Control
                      type="permanentResidence"
                      placeholder="Hộ khẩu thường trú"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="fatherEmail">
                    <Form.Label>Email bố</Form.Label>
                    <Form.Control type="fatherEmail" placeholder="Email bố" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="address">
                    <Form.Label>Nơi ở hiện nay</Form.Label>
                    <Form.Control type="address" placeholder="Nơi ở hiện nay" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="motherName">
                    <Form.Label>Họ tên mẹ</Form.Label>
                    <Form.Control type="motherName" placeholder="Họ tên mẹ" />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="dateOfUnion">
                    <Form.Label>Ngày vào Đoàn</Form.Label>
                    <Form.Control
                      type="dateOfUnion"
                      placeholder="Ngày vào Đoàn"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="motherPhone">
                    <Form.Label>Số điện thoại mẹ</Form.Label>
                    <Form.Control
                      type="motherPhone"
                      placeholder="Số điện thoại mẹ"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="dateOfParty">
                    <Form.Label>Ngày vào Đảng</Form.Label>
                    <Form.Control
                      type="dateOfParty"
                      placeholder="Ngày vào Đảng"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="motherMail">
                    <Form.Label>Email mẹ</Form.Label>
                    <Form.Control
                      type="motherMail"
                      placeholder="Email Mẹ"
                    />
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
          <text> Quản lý danh mục học sinh</text>
        </div>
        <br></br>
        <div className="btn-toolbar">
          <Button className="button" variant="light">
            Tải lại trang
            <BsArrowRepeat className="reload-icon" size={20} />
          </Button>
          <Button onClick={this.open} className="button" variant="light">
            Thêm học sinh
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
export default Student;
