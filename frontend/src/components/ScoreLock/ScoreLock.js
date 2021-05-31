import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/ScoreLock.css';
import Pagination from '../Pagination/Pagination'
import Loading from '../Loading/Loading'
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import { store } from 'react-notifications-component';
import { BiRefresh } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { Modal, Button } from 'react-bootstrap';

class ScoreLock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreLockList: [],
            schoolYearList: [],
            loading: true,
            showConfirm: false,
            modalData: {},
            perpage: 10,
            pagination: {
                currentPage: 1,
                lastPage: 1,
            },
        };
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            let [schoolYearList, scoreLockList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getScoreLockList(1, 1000000)
            ])
            schoolYearList = schoolYearList.data.result.data
            scoreLockList = scoreLockList.data.result.data
            //console.log(schoolYearList, scoreLockList)
            let listAdd = []
            for (let i = 0; i < schoolYearList.length; i++) {
                if (scoreLockList.findIndex(e => e.schoolYearId === schoolYearList[i].schoolYearId) === -1) {
                    listAdd.push(
                        Api.addScoreLock({
                            schoolYearId: schoolYearList[i].schoolYearId,
                            term: 1,
                            lock: 1,
                        }),
                        Api.addScoreLock({
                            schoolYearId: schoolYearList[i].schoolYearId,
                            term: 2,
                            lock: 1,
                        }),
                    );
                }
            }
            this.setState({ schoolYearList: schoolYearList })
            await Promise.all(listAdd)
            await this.refresh(1, this.state.perpage)
            this.setState({ loading: false })
        } catch (err) {
            this.setState({ loading: false })
        }
    }

    back = () => {
        this.props.history.goBack()
    }

    refresh = async (page, perpage) => {
        this.setState({ loading: true })
        try {
            let res = await Api.getScoreLockList(page || this.state.pagination.currentPage, perpage || this.state.perpage)
            console.log(res)
            this.setState({ loading: false, scoreLockList: res.data.result.data, pagination: res.data.result.pagination })
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

    renderTableData = () => {
        let sttBase = this.state.perpage * (this.state.pagination.currentPage - 1) + 1
        let schoolYearList = this.state.schoolYearList
        return this.state.scoreLockList.map((data, index) => {
            const { schoolYearId, term, lock } = data;
            return (
                <tr key={index}>
                    <td className="text-center">{sttBase + index}</td>
                    <td className="text-center">{schoolYearList.find(e => e.schoolYearId === schoolYearId).schoolYear}</td>
                    <td className="text-center">{term}</td>
                    <td className="text-center">{lock ? "Khóa" : "Mở"}</td>
                    <td className="text-center">
                        <button type="button" className="change-state-btn" onClick={() => lock ? this.unlock(index) : this.lock(index)} >{lock ? "Mở" : "Khóa"}</button>
                    </td>
                </tr>
            );
        });
    }

    lock = (index) => {
        let scoreLock = this.state.scoreLockList[index]
        this.setState({
            showConfirm: true,
            modalData: {
                method: "lock",
                schoolYear: this.state.schoolYearList.find(e => e.schoolYearId === scoreLock.schoolYearId).schoolYear,
                ...scoreLock,
            }
        })
    }

    unlock = (index) => {
        let scoreLock = this.state.scoreLockList[index]
        this.setState({
            showConfirm: true,
            modalData: {
                method: "unlock",
                schoolYear: this.state.schoolYearList.find(e => e.schoolYearId === scoreLock.schoolYearId).schoolYear,
                ...scoreLock,
            }
        })
    }

    closeConfirm = () => {
        this.setState({ showConfirm: false })
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
                <Confirm
                    show={this.state.showConfirm}
                    close={this.closeConfirm}
                    data={this.state.modalData}
                    refresh={this.refresh}
                />
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Khóa mở nhập điểm
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => { this.refresh() }}>
                                <BiRefresh size={this.state.iconSize} />Tải lại trang
                            </button>
                            <label className="ml-4">Số lượng bản ghi mỗi trang:</label>
                            <select className="form-control-sm ml-3" value={this.state.perpage} onChange={this.changePerPage} style={{ width: "70px" }}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <div className="d-flex ml-auto">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Tìm kiếm" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button"><BsSearch /></button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div style={{ minHeight: "430px" }}>
                            <table className="table table-bordered">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>Năm học</th>
                                        <th>Kì học</th>
                                        <th>Trạng thái</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination pagination={this.state.pagination} changePage={this.changePage} />
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

    submit = async () => {
        this.setState({ loading: true })
        try {
            this.props.data.method === "lock" ? await Api.lockScoreLock(this.props.data) : await Api.unlockScoreLock(this.props.data)
            //console.log(res)
            this.setState({ loading: false })
            store.addNotification({
                title: "Thành công",
                message: this.props.data.method === "lock" ? "Khóa thành công" : "Mở thành công",
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
                        <Modal.Title>Xác nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {"Bạn chắc chắn muốn "} {this.props.data.method === "lock" ? "khóa nhập điểm" : "mở nhập điểm"} {" kì học "} <b> {this.props.data.term} </b> {" năm học "} <b> {this.props.data.schoolYear} </b> {" ?"}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.close}>Hủy</Button>
                        <Button variant="danger" onClick={this.submit}>{this.props.data.method === "lock" ? "Khóa" : "Mở"}</Button>
                    </Modal.Footer>
                </Modal>
                <Loading show={this.state.loading} />
            </div>
        )
    }
}

export default withRouter(ScoreLock);
