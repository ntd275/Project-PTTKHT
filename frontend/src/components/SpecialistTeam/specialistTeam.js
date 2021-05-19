import {
    BsArrowLeftShort,
    BsArrowRepeat,
    BsTrash,
    BsChevronRight,
    BsChevronLeft,
    BsChevronDoubleRight,
    BsChevronDoubleLeft,
  } from "react-icons/bs";
  import { Modal, Col, Row, Form } from "react-bootstrap";
  import { GoPlus } from "react-icons/go";
  import { FaPencilAlt } from "react-icons/fa";
  import React from "react";
  import "../../css/SpecialistTeam.css";
  import { Button } from "react-bootstrap";
  import { Table } from "react-bootstrap";
  class SpecialistTeam extends React.Component {
    constructor(props) {
      super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
      this.state = {
        //state is by default an object
        specialistTeams: [
          {
            stt: 1,
            specialistTeamName: "Toán",
            toDelete: <BsTrash />,
            toAdd: <FaPencilAlt />,
          },
          {
            stt: 2,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 3,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 4,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 5,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 6,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 7,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 8,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 9,
            specialistTeamName: "",
            toDelete: "",
            toAdd: "",
          },
          {
            stt: 10,
            specialistTeamName: "",
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
      return this.state.specialistTeams.map((subject, index) => {
        const { stt, specialistTeamName, toDelete, toAdd } = subject;
        return (
          <tr key={stt}>
            <td>{stt}</td>
            <td>{specialistTeamName}</td>
            <td>{toDelete}</td>
            <td>{toAdd}</td>
          </tr>
        );
      });
    }
    renderTableHeader() {
      let header = Object.keys(this.state.specialistTeams[0]);
      return header.map((key, index) => {
        if (key === "toDelete") return <th key={index}>{<BsTrash />}</th>;
        if (key === "stt") return <th key={index}>STT</th>;
        if (key === "specialistTeamName") return <th key={index}>Tên tổ chuyên môn</th>;
        if (key === "toAdd") return <th key={index}>{<FaPencilAlt />}</th>;
        return <th key={index}>{key}</th>;
      });
    }
  
    render() {
      const { specialistTeams } = this.state;
      let buttons = Object.keys(specialistTeams);
      let values = buttons.map((key) => specialistTeams[key].stt);
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
        <div className="SpecialistTeam">
           <Modal  show={this.state.showModal} onHide={this.close} centered>
          <Modal.Header closeButton>
            <Modal.Title >Thêm tổ chuyên môn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <Row>
                <Form.Control placeholder="Tên tổ chuyên môn" />
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
            <text > Quản lý danh mục tổ chuyên môn</text>
          </div>
          <br></br>
          <div className="btn-toolbar">
            <Button className="button" variant="light">
              Tải lại trang
              <BsArrowRepeat className="reload-icon" size={20} />
            </Button>
            <Button onClick={this.open}  className="button" variant="light">
              Thêm tổ chuyên môn
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
  export default SpecialistTeam;
  