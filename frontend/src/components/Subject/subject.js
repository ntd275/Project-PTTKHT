import {
    BsArrowLeftShort,
    BsArrowRepeat,
    BsTrash,
    BsChevronRight,
    BsChevronLeft,
    BsChevronDoubleRight,
    BsChevronDoubleLeft,
  } from "react-icons/bs";
  import {AiOutlineSearch} from "react-icons/ai"
  import { Modal, Col, Row, Form } from "react-bootstrap";
  import { GoPlus } from "react-icons/go";
  import { FaPencilAlt } from "react-icons/fa";
  import React from "react";
  import "../../css/Subject.css";
  import { Button } from "react-bootstrap";
  import { Table } from "react-bootstrap";
  class Subject extends React.Component {
    constructor(props) {
      super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
      this.state = {
        //state is by default an object
        subjects: [
          {
            stt: 1,
            subjectCode: "TOAN",
            subjectName: "Toán",
            toDelete: <BsTrash />,
            toAdd: <FaPencilAlt />,
          },
          {
            stt: 2,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 3,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 4,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 5,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 6,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 7,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 8,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 9,
            subjectCode: "",
            subjectName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 10,
            subjectCode: "",
            subjectName: "",
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
      return this.state.subjects.map((subject, index) => {
        const { stt, subjectCode, subjectName, toDelete, toAdd } = subject;
        return (
          <tr key={stt}>
            <td>{stt}</td>
            <td>{subjectCode}</td>
            <td>{subjectName}</td>
            <td>{toDelete}</td>
            <td>{toAdd}</td>
          </tr>
        );
      });
    }
    renderTableHeader() {
      let header = Object.keys(this.state.subjects[0]);
      return header.map((key, index) => {
        if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
        if (key === "stt") return <th key={index}>STT</th>;
        if (key === "subjectName") return <th key={index}>Tên môn học</th>;
        if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
        if (key === "subjectCode") return <th key={index}>Mã môn học</th>;
        return <th key={index}>{key}</th>;
      });
    }
  
    render() {
      const { subjects } = this.state;
      let buttons = Object.keys(subjects);
      let values = buttons.map((key) => subjects[key].stt);
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
        <div className="Subject">
           <Modal  show={this.state.showModal} onHide={this.close} centered>
          <Modal.Header closeButton>
            <Modal.Title >Thêm môn học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <Row>
                <Form.Control placeholder="Tên môn học" />
              </Row> <br/>
              <Row>
                <Form.Control placeholder="Mã môn học" />
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
            <text > Quản lý danh mục môn học</text>
          </div>
          <br></br>
          <div className="btn-toolbar">
            <Button className="button" variant="light">
              Tải lại trang
              <BsArrowRepeat className="reload-icon" size={20} />
            </Button>
            <Button onClick={this.open}  className="button" variant="light">
              Thêm môn học
              <GoPlus className="reload-icon" size={20} />
            </Button>
            <p className="text">
              <text style={{marginRight:10}}>Số lượng bản ghi mỗi trang</text>
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
  export default Subject;
  