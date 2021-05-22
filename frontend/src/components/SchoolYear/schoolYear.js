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
import { Form } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import React from "react";
import "../../css/SchoolYear.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
class SchoolYear extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      //state is by default an object
      years: [
        {
          stt: 1,
          schoolYear: "2020-2021",
          description: "Năm đầu tiên dùng sổ liên lạc điện tử",
          toDelete: <BsTrash />,
          toAdd: <FaPencilAlt />,
        },
        {
          stt: 2,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 3,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 4,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 5,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 6,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 7,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 8,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 9,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 10,
          schoolYear: "",
          description: "",
          toDelete: "",
          toAdd: "",
        },
      ],
      startFirstSemester: new Date(),
      finishFirstSemester: new Date(),
      startSecondSemester: new Date(),
      finishSecondSemester: new Date(),

    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleStartFirstSemesterChange = this.handleStartFirstSemesterChange.bind(this);
    this.handleFinishFirstSemesterChange = this.handleFinishFirstSemesterChange.bind(this);
    this.handleStartSecondSemesterChange = this.handleStartSecondSemesterChange.bind(this);
    this.handleFinishSecondSemesterChange = this.handleFinishSecondSemesterChange.bind(this);
  }
  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }
  handleStartFirstSemesterChange(date) {
    this.setState({
      startFirstSemester: date,
    });
  }
  handleFinishFirstSemesterChange(date) {
    this.setState({
      finishFirstSemester: date,
    });
  }
  handleStartSecondSemesterChange(date) {
    this.setState({
      startSecondSemester: date,
    });
  }
  handleFinishSecondSemesterChange(date) {
    this.setState({
      finishSecondSemester: date,
    });
  }

  renderTableData() {
    return this.state.years.map((student, index) => {
      const { stt, schoolYear, description, toDelete, toAdd } = student;
      return (
        <tr key={stt}>
          <td>{stt}</td>
          <td>{schoolYear}</td>
          <td>{description}</td>
          <td>{toDelete}</td>
          <td>{toAdd}</td>
        </tr>
      );
    });
  }
  renderTableHeader() {
    let header = Object.keys(this.state.years[0]);
    return header.map((key, index) => {
      if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
      if (key === "stt") return <th key={index}>STT</th>;
      if (key === "description") return <th key={index}>Mô tả</th>;
      if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
      if (key === "schoolYear") return <th key={index}>Năm Học</th>;
      return <th key={index}>{key}</th>;
    });
  }

  render() {
    const { years } = this.state;
    let buttons = Object.keys(years);
    let values = buttons.map((key) => years[key].stt);
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
      <div className="SchoolYear">
        <Modal show={this.state.showModal} onHide={this.close} centered>
          <Modal.Header closeButton>
            <Modal.Title>Thêm năm học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="schoolYear">
                <Form.Label>Năm học</Form.Label>
                <Form.Control type="text" placeholder="Năm học " />
              </Form.Group>

              <Form.Group controlId="startFirstSemester">
                <Form.Label>
                  Bắt đầu kì 1
                  <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                </Form.Label>
                <div className="form-group">
                    <DatePicker
                      selected={this.state.startFirstSemester}
                      onChange={this.handleStartFirstSemesterChange}
                      name="startFirstSemester"
                      dateFormat="MM/dd/yyyy"
                    />
                </div>
              </Form.Group>

              <Form.Group controlId="finishFirstSemester">
                <Form.Label>
                  Kết thúc kì 1
                  <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                </Form.Label>
                <div className="form-group">
                    <DatePicker
                      selected={this.state.finishFirstSemester}
                      onChange={this.handleFinishFirstSemesterChange}
                      name="finishFirstSemester"
                      dateFormat="MM/dd/yyyy"
                    />
                </div>
              </Form.Group>

              <Form.Group controlId="startSecondSemester">
                <Form.Label>
                  Bắt đầu kì 2
                  <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                </Form.Label>
                <div className="form-group">
                    <DatePicker
                      selected={this.state.startSecondSemester}
                      onChange={this.handleStartSecondSemesterChange}
                      name="startSecondSemester"
                      dateFormat="MM/dd/yyyy"
                    />
                </div>
              </Form.Group>

              <Form.Group controlId="finishSecondSemester">
                <Form.Label>
                  Kết thúc kì 2
                  <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                </Form.Label>
                <div className="form-group">
                    <DatePicker
                      selected={this.state.finishSecondSemester}
                      onChange={this.handleFinishSecondSemesterChange}
                      name="finishSecondSemester"
                      dateFormat="MM/dd/yyyy"
                    />
                </div>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>
                 Mô tả
                  <FaRegCalendarAlt style={{ marginLeft: 10 }} />
                </Form.Label>
                <Form.Control type="text" placeholder="Mô tả" />
              </Form.Group>
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
          <text> Quản lý danh mục năm học</text>
        </div>
        <br></br>
        <div className="btn-toolbar">
          <Button className="button" variant="light">
            Tải lại trang
            <BsArrowRepeat className="reload-icon" size={20} />
          </Button>
          <Button onClick={this.open} className="button" variant="light">
            Thêm năm học
            <GoPlus className="reload-icon" size={20} />
          </Button>
          <p className="text" style={{ marginRight: 10 }}>
            <text style={{ marginRight: 10 }}>Số lượng bản ghi mỗi trang</text>
            <input name="numrecord" size={1}></input>
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
export default SchoolYear;
