import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/TeachingClassScore.css';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import { Modal, Button } from 'react-bootstrap'
import { BsArrowLeftShort } from 'react-icons/bs'
import XLSX from "xlsx";


class TeachingClassScore extends Component {
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
                kind: "edit"
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
            let checkLock = await Api.checkLock(info.schoolYearId, info.term)
            console.log(checkLock)
            if (checkLock.data.result.lock) {
                store.addNotification({
                    title: "Không thể nhập điểm",
                    message: "Hiện tại đang khóa nhập điểm vui lòng chờ đến thời điểm nhập điểm hoặc liên hệ quản trị viên",
                    type: "warning",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.props.history.push("/my-teaching-assignment", {
                    kind: "edit"
                })
                return
            }
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
                        <input className="score-input form-control" type="text" value={scoreMouth[i].score} onChange={(e) => this.changeScore(index, 0, i, e)} />
                    </td>
                )
            }
            for (let i = 0; i < score15.length; i++) {
                list.push(
                    <td className="td-score" key={"score15" + i}>
                        <input className="score-input form-control" type="text" value={score15[i].score} onChange={(e) => this.changeScore(index, 1, i, e)} />
                    </td>
                )
            }
            for (let i = 0; i < score45.length; i++) {
                list.push(
                    <td className="td-score" key={"score45" + i}>
                        <input className="score-input form-control" type="text" value={score45[i].score} onChange={(e) => this.changeScore(index, 2, i, e)} />
                    </td>
                )
            }
            list.push(
                <td className="td-score" key={"score-term"}>
                    <input className="score-input form-control" type="text" value={scoreTerm.score} onChange={(e) => this.changeScore(index, 3, 0, e)} />
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

    changeScore = (index, kind, pos, event) => {
        let value = event.target.value;
        let scoreList = this.state.scoreList
        switch (kind) {
            case 0: scoreList[index].scoreMouth[pos].score = value; scoreList[index].scoreMouth[pos].edited = true; break;
            case 1: scoreList[index].score15[pos].score = value; scoreList[index].score15[pos].edited = true; break;
            case 2: scoreList[index].score45[pos].score = value; scoreList[index].score45[pos].edited = true; break;
            case 3: scoreList[index].scoreTerm.score = value; scoreList[index].scoreTerm.edited = true; break;
            default:
        }
        this.setState({
            edited: true,
            scoreList: scoreList
        })
    }

    validateScore = (score) => {
        if (score === "") {
            return true
        }
        if (isNaN(score)) {
            store.addNotification({
                title: "Lỗi ",
                message: "Điểm nhập phải là số",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false
        }

        if (parseFloat(score) < 0 || parseFloat(score) > 10) {
            store.addNotification({
                title: "Lỗi ",
                message: "Điểm nhập phải >= 0 và <= 10",
                type: "warning",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    showIcon: true,
                },
                animationIn: ["animate__backInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            return false
        }

        return true
    }

    submit = async () => {
        if (!this.state.edited) {
            return
        }
        this.setState({
            submitLoading: true,
        })
        try {
            let list = [];
            let scoreList = this.state.scoreList;
            for (let i = 0; i < scoreList.length; i++) {
                let scores = []
                for (let j = 0; j < scoreList[i].scoreMouth.length; j++) {
                    let score = scoreList[i].scoreMouth[j];
                    if (!score.edited) {
                        continue
                    }

                    if (!this.validateScore(score.score)) {
                        return
                    }

                    if (!score.scoreId) {
                        if (score.score === "") {
                            continue
                        }
                        scores.push({
                            method: "add",
                            ...score,
                        })
                        continue
                    }

                    if (score.score === "") {
                        scores.push({
                            method: "delete",
                            ...score,
                        })
                        continue
                    }

                    scores.push({
                        method: "edit",
                        ...score,
                    })
                }

                for (let j = 0; j < scoreList[i].score15.length; j++) {
                    let score = scoreList[i].score15[j];
                    if (!score.edited) {
                        continue
                    }
                    if (!this.validateScore(score.score)) {
                        return
                    }
                    if (!score.scoreId) {
                        if (score.score === "") {
                            continue
                        }
                        scores.push({
                            method: "add",
                            ...score,
                        })
                        continue
                    }

                    if (score.score === "") {
                        scores.push({
                            method: "delete",
                            ...score,
                        })
                        continue
                    }

                    scores.push({
                        method: "edit",
                        ...score,
                    })
                }

                for (let j = 0; j < scoreList[i].score45.length; j++) {
                    let score = scoreList[i].score45[j];
                    if (!score.edited) {
                        continue
                    }
                    if (!this.validateScore(score.score)) {
                        return
                    }
                    if (!score.scoreId) {
                        if (score.score === "") {
                            continue
                        }

                        scores.push({
                            method: "add",
                            ...score,
                        })
                        continue
                    }

                    if (score.score === "") {
                        scores.push({
                            method: "delete",
                            ...score,
                        })
                        continue
                    }

                    scores.push({
                        method: "edit",
                        ...score,
                    })
                }

                let score = scoreList[i].scoreTerm;
                if (score.edited) {
                    if (!this.validateScore(score.score)) {
                        return
                    }
                    if (!score.scoreId) {
                        scores.push({
                            method: "add",
                            ...score,
                        })
                    } else {
                        if (score.score === "") {
                            scores.push({
                                method: "delete",
                                ...score,
                            })
                        } else {
                            scores.push({
                                method: "edit",
                                ...score,
                            })
                        }
                    }
                }
                list.push({
                    studentId: scoreList[i].studentId,
                    scores: scores
                })
            }
            await Api.editScore({ students: list })
            await this.refresh()
            store.addNotification({
                title: "Thành công",
                message: `Cập nhật điểm thành công`,
                type: "success",
                container: "top-center",
                dismiss: {
                    duration: 5000,
                    //showIcon: true,
                },
                animationIn: ["animate__slideInDown", "animate__animated"],
                animationOut: ["animate__fadeOutUp", "animate__animated"],
            })
            this.setState({ submitLoading: false, edited: false })
        } catch (err) {
            console.log(err)
            this.setState({ submitLoading: false })
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

    closeConfirm = () => {
        this.setState({ showConfirm: false })
    }

    exportFile = () => {
        let data = []
        data.push(["STT", "MSHS", "Họ tên", "Miệng", "", "", "", "", "15 phút", "", "", "", "", "1 tiết", "", "", "Thi"])
        let scoreList = this.state.scoreList
        scoreList.forEach((score, index) => {
            let row = [index + 1, score.studentCode, score.studentName]
            let scoreMouth = score.scoreMouth.map((e) => e.score)
            row.push(...scoreMouth)
            let score15 = score.score15.map((e) => e.score)
            row.push(...score15)
            let score45 = score.score45.map((e) => e.score)
            row.push(...score45)
            row.push(score.scoreTerm.score)
            data.push(row)
        })
        let ws = XLSX.utils.aoa_to_sheet(data)
        ws['!merges'] = [
            {
                s: { r: 0, c: 3 },
                e: { r: 0, c: 7 }
            },
            {
                s: { r: 0, c: 8 },
                e: { r: 0, c: 12 }
            },
            {
                s: { r: 0, c: 13 },
                e: { r: 0, c: 15 }
            },
        ]
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Score");
        // /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "score.xlsx");
    }

    SheetJSFT = [
        "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
    ].map(x => `.${x}`).join(",");

    importFile = (e) => {
        const files = e.target.files;
        if (!files || !files[0]) {
            return
        }
        const file = files[0]
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            let scoreList = this.state.scoreList
            console.log(scoreList, data)
            try {
                for (let i = 1; i < data.length; i++) {
                    let scoreNew = data[i]
                    let scoreOld = scoreList[i - 1]
                    console.log(scoreNew, scoreOld)
                    if (scoreOld.studentCode !== scoreNew[1]) {
                        store.addNotification({
                            title: "Lỗi",
                            message: "File nhập không đúng định dạng",
                            type: "danger",
                            container: "top-center",
                            dismiss: {
                                duration: 5000,
                                showIcon: true,
                            },
                            animationIn: ["animate__backInDown", "animate__animated"],
                            animationOut: ["animate__fadeOutUp", "animate__animated"],
                        })
                        this.refresh()
                        return
                    }
                    for (let j = 3; j <= 7; j++) {
                        if (scoreOld.scoreMouth[j - 3].score !== scoreNew[j]) {
                            scoreOld.scoreMouth[j - 3].edited = true;
                            if (!scoreNew[j]) {
                                scoreOld.scoreMouth[j - 3].score = ""
                            } else {
                                scoreOld.scoreMouth[j - 3].score = scoreNew[j]
                            }
                        }
                    }
                    for (let i = 8; i <= 12; i++) {
                        if (scoreOld.score15[i - 8].score !== scoreNew[i]) {
                            scoreOld.score15[i - 8].edited = true;
                            if (!scoreNew[i]) {
                                scoreOld.score15[i - 8].score = ""
                            } else {
                                scoreOld.score15[i - 8].score = scoreNew[i]
                            }
                        }
                    }
                    for (let i = 13; i <= 15; i++) {
                        if (scoreOld.score45[i - 13].score !== scoreNew[i]) {
                            scoreOld.score45[i - 13].edited = true;
                            if (!scoreNew[i]) {
                                scoreOld.score45[i - 13].score = ""
                            } else {
                                scoreOld.score45[i - 13].score = scoreNew[i]
                            }
                        }
                    }
                    if (scoreOld.scoreTerm.score !== scoreNew[16]) {
                        scoreOld.scoreTerm.edited = true;
                        if (!scoreNew[16]) {
                            scoreOld.scoreTerm.score = ""
                        } else {
                            scoreOld.scoreTerm.score = scoreNew[16]
                        }
                    }
                }
                this.setState({
                    scoreList: scoreList,
                    edited: true,
                })
                store.addNotification({
                    title: "Thành công",
                    message: `Nhập file thành công!    Kết quả được hiển thị ở bảng.     Ấn lưu để lưu lại`,
                    type: "success",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        //showIcon: true,
                    },
                    animationIn: ["animate__slideInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })

            } catch (err) {
                console.log(err);
                store.addNotification({
                    title: "Lỗi",
                    message: "File nhập không đúng định dạng",
                    type: "danger",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.refresh()
            }
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
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
                            Nhập điểm
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
                    <div className="col-6">
                        <input
                            type="file"
                            ref={el => this.inputRef = el}
                            onChange={this.importFile}
                            style={{ display: "none" }}
                            accept={this.SheetJSFT}
                        />
                        <button type="button" className="btn btn-primary mr-4" onClick={() => { this.inputRef.click() }} >Nhập điểm từ file Excel</button>
                        <button type="button" className="btn btn-primary" onClick={() => this.exportFile()}>Xuất file điểm</button>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <form className="text-center">
                            <table id="score-table" className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>MSHS</th>
                                        <th>Họ tên</th>
                                        <th colSpan="5">Miệng</th>
                                        <th colSpan="5">15 phút</th>
                                        <th colSpan="3">1 tiết</th>
                                        <th>Thi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </form>
                        <button className="btn btn-primary" onClick={() => { this.submit(); this.setState({ submitLoading: false }) }}>Lưu</button>
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

export default withRouter(TeachingClassScore);