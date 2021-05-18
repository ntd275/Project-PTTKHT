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
import { AiOutlineSearch } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import React from "react";
import "../../css/Class.css";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";

class Class extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      //state is by default an object
      showModel: true,
      classes: [
        {
          stt: 1,
          classCode: "9A",
          className: "Lớp 9A",
          toDelete: <BsTrash />,
          toAdd: <FaPencilAlt />,
        },
        {
          stt: 2,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 3,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 4,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 5,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 6,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 7,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 8,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 9,
          classCode: "",
          className: "",
          toDelete: "",
          toAdd: "",
        },
        {
          stt: 10,
          classCode: "",
          className: "",
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
    return this.state.classes.map((student, index) => {
      const { stt, classCode, className, toDelete, toAdd } = student;
      return (
        <tr key={stt}>
          <td>{stt}</td>
          <td>{classCode}</td>
          <td>{className}</td>
          <td>{toDelete}</td>
          <td>{toAdd}</td>
        </tr>
      );
    });
  }
  renderTableHeader() {
    let header = Object.keys(this.state.classes[0]);
    return header.map((key, index) => {
      if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
      if (key === "stt") return <th key={index}>STT</th>;
      if (key === "className") return <th key={index}>Tên lớp</th>;
      if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
      if (key === "classCode") return <th key={index}>Mã lớp</th>;
      return <th key={index}>{key}</th>;
    });
  }

  render() {
    const { classes } = this.state;
    let buttons = Object.keys(classes);
    let values = buttons.map((key) => classes[key].stt);
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
      <div className="Class">
        <Modal  show={this.state.showModal} onHide={this.close} centered>
          <Modal.Header closeButton>
            <Modal.Title >Thêm lớp học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <Row>
                <Form.Control placeholder="Tên lớp học" />
              </Row> <br/>
              <Row>
                <Form.Control placeholder="Mã lớp học" />
              </Row> <br/>
              <Row>
                <Form.Control placeholder="Mô tả" />
              </Row> <br/>
            </Form>
          </Modal.Body>
          <Modal.Footer >
            <Button onClick={this.close}>Thêm</Button>
          </Modal.Footer>
        </Modal>
        <div>
          <Button className="back" variant="dark">
            <BsArrowLeftShort size={50} />
          </Button>
          <text> Quản lý danh mục lớp học</text>
        </div>
        <br></br>
        <div className="btn-toolbar">
          <Button className="button" variant="light">
            Tải lại trang
            <BsArrowRepeat className="reload-icon" size={20} />
          </Button>

          <Button className="button" onClick={this.open} variant="light">
            Thêm lớp học
            <GoPlus className="reload-icon" size={20} />
          </Button>
          <p className="text">
            <text style={{ marginRight: 10 }}>Số lượng bản ghi mỗi trang</text>
            <input size={1}></input>
            <input name="search" placeholder="Tìm kiếm" style={{marginLeft:800, width:200}}></input>   
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
export default Class;
