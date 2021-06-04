import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/TeachingClassScore.css';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { Modal, Button } from 'react-bootstrap'
import { BsArrowLeftShort } from 'react-icons/bs'


class SearchScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            info: {},
            scoreList: [],
            edited: false,
            submitLoading: false,
            showConfirm: false,
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })
        //console.log(this.props.location.state);
        if (!this.props.location.state) {
            this.props.history.push("/my-teaching-assignment", {
                kind: "info"
            })
            return
        }

        this.unblock = this.props.history.block(tx => {
            if (!this.state.edited) {
                this.unblock()
                return true
            } else {
                this.setState({
                    showConfirm: true,
                })
                return false
            }
        });
        let info = this.props.location.state
        this.setState({ info: info })
        try {
            await this.refresh()
            this.setState({ loading: false })
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

    back = () => {
        this.props.history.goBack()
    }

    componentWillUnmount() {
        if (this.unblock) {
            this.unblock()
        }
    }

    refresh = async () => {
        let info = this.props.location.state
        this.setState({ loading: true })
        try {
            let studentAssignmentList = await Api.searchStudentAssignment(1, 1000000, {
                schoolYearId: info.schoolYearId,
                classId: info.classId,
            })
            studentAssignmentList = studentAssignmentList.data.result.data
            //console.log(studentAssignmentList)
            let listApi = []
            for (let i = 0; i < studentAssignmentList.length; i++) {
                listApi.push(
                    Api.getSubjectScore(studentAssignmentList[i].studentId, info.subjectId, info.schoolYearId, info.term)
                )
            }
            let scoreList = await Promise.all(listApi);
            //console.log(scoreList)
            let list = [];
            for (let i = 0; i < scoreList.length; i++) {
                list.push({
                    ...studentAssignmentList[i],
                    scoreMouth: [],
                    score15: [],
                    score45: [],
                    scoreTerm: {},
                })
                let scores = scoreList[i].data.scores
                for (let j = 0; j < scores.length; j++) {
                    switch (scores[j].kind) {
                        case 0: list[i].scoreMouth.push(scores[j]);
                            break;
                        case 1: list[i].score15.push(scores[j]);
                            break;
                        case 2: list[i].score45.push(scores[j]);
                            break;
                        case 3: list[i].scoreTerm = scores[j];
                            break;
                        default:
                    }
                }
                while (list[i].scoreMouth.length < 5) {
                    list[i].scoreMouth.push({
                        kind: 0,
                        schoolYearId: info.schoolYearId,
                        score: "",
                        studentId: studentAssignmentList[i].studentId,
                        subjectId: info.subjectId,
                        teacherId: info.teacherId,
                        term: info.term,
                    })
                }
                while (list[i].score15.length < 5) {
                    list[i].score15.push({
                        kind: 1,
                        schoolYearId: info.schoolYearId,
                        score: "",
                        studentId: studentAssignmentList[i].studentId,
                        subjectId: info.subjectId,
                        teacherId: info.teacherId,
                        term: info.term,
                    })
                }
                while (list[i].score45.length < 3) {
                    list[i].score45.push({
                        kind: 2,
                        schoolYearId: info.schoolYearId,
                        score: "",
                        studentId: studentAssignmentList[i].studentId,
                        subjectId: info.subjectId,
                        teacherId: info.teacherId,
                        term: info.term,
                    })
                }
                if (!list[i].scoreTerm.scoreId) {
                    list[i].scoreTerm = {
                        kind: 3,
                        schoolYearId: info.schoolYearId,
                        score: "",
                        studentId: studentAssignmentList[i].studentId,
                        subjectId: info.subjectId,
                        teacherId: info.teacherId,
                        term: info.term,
                    }
                }
            }
            console.log(list)
            this.setState({
                loading: false,
                scoreList: list,
            })
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

    renderTableData() {
        let sttBase = 1
        return this.state.scoreList.map((data, index) => {
            const { studentCode, studentName, scoreMouth, score15, score45, scoreTerm } = data;
            let list = []
            for (let i = 0; i < scoreMouth.length; i++) {
                list.push(
                    <td className="td-score" key={"mouth" + i}>
                        <input disabled className="score-input form-control" type="text" value={scoreMouth[i].score} onChange={(e) => this.changeScore(index, 0, i, e)} />
                    </td>
                )
            }
            for (let i = 0; i < score15.length; i++) {
                list.push(
                    <td className="td-score" key={"score15" + i}>
                        <input disabled className="score-input form-control" type="text" value={score15[i].score} onChange={(e) => this.changeScore(index, 1, i, e)} />
                    </td>
                )
            }
            for (let i = 0; i < score45.length; i++) {
                list.push(
                    <td className="td-score" key={"score45" + i}>
                        <input disabled className="score-input form-control" type="text" value={score45[i].score} onChange={(e) => this.changeScore(index, 2, i, e)} />
                    </td>
                )
            }
            list.push(
                <td className="td-score" key={"score-term"}>
                    <input disabled className="score-input form-control" type="text" value={scoreTerm.score} onChange={(e) => this.changeScore(index, 3, 0, e)} />
                </td>
            )
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{studentCode}</td>
                    <td>{studentName}</td>
                    {list}
                </tr>
            );
        });
    }






    render() {
        //console.log(this.state)
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
            <div className="container-fluid">
                <Confirm
                    show={this.state.showConfirm}
                    close={this.closeConfirm}
                    unblock={this.unblock}
                    goBack={this.back}
                />
                <Loading show={this.state.submitLoading} />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Tra cứu điểm
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-6 mt-1">
                        <span className="mr-4 align-middle">
                            <b>Năm học: </b>{this.state.info.schoolYear}
                        </span>
                        <span className="mr-4 align-middle">
                            <b>Lớp: </b>{this.state.info.className}
                        </span>
                        <span className="mr-4 align-middle">
                            <b>Học kỳ: </b>{this.state.info.term}
                        </span>

                        <span className="align-middle">
                            <b>Môn: </b>{this.state.info.subjectName}
                        </span>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <form className="text-center">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>MSHS</th>
                                        <th>Họ tên</th>
                                        <th colSpan="5">Miệng</th>
                                        <th colSpan="5">15 phút</th>
                                        <th colSpan="3">1 tiết</th>
                                        <th>thi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.props.show} backdrop="static" keyboard={false} >
                    <Modal.Header>
                        <Modal.Title>Xác nhận thoát</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {"Bạn chắc chắn muốn thoát, các thay đổi sẽ không được lưu ?"}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.close}>Hủy</Button>
                        <Button variant="danger" onClick={() => { this.props.unblock(); this.props.goBack() }}>Thoát</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>

        )
    }
}

export default withRouter(SearchScore);