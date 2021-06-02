import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/Statistic/RankStatistic.css';
import { store } from 'react-notifications-component';
import Loading from '../Loading/Loading'
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'


class RankStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            searchCondition: {},
            iconSize: '15px',
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, classList] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getClassList(1, 1000000)
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                classId: classList.data.result.data[0].classId,
                term: 1,
            }
            console.log(searchCondition)
            this.setState({
                classList: classList.data.result.data,
                schoolYearList: schoolYearList.data.result.data,
                searchCondition: searchCondition,
                loading: false
            })
            this.refresh(searchCondition)
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

    refresh = async (searchCondition) => {
        this.setState({ loading: true })
        try {
            let res = await Api.getRankReport(1, 1000000, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                loading: false,
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

    getSchoolYearOption = () => {
        let list = this.state.schoolYearList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { schoolYearId, schoolYear } = list[i];
            options.push({
                name: schoolYear,
                value: schoolYearId
            })
        }
        return options
    }

    getClassOption = () => {
        let list = this.state.classList
        let options = []
        for (let i = 0; i < list.length; i++) {
            let { classId, className } = list[i];
            options.push({
                name: className,
                value: classId
            })
        }
        return options
    }

    changeSearchCondition = (name, value) => {
        console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        this.setState({ searchCondition: searchCondition })
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
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label>Năm học:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={this.getSchoolYearOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.schoolYearId}
                                    onChange={v => this.changeSearchCondition("schoolYearId", v)}
                                />
                            </div>
                            <label className="ml-2">Lớp:</label>
                            <div className="ml-1 select-class">
                                <SelectSearch
                                    options={this.getClassOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.classId}
                                    onChange={v => this.changeSearchCondition("classId", v)}
                                />
                            </div>
                            <label className="ml-2">Học kỳ:</label>
                            <div className="ml-1 select-term">
                                <SelectSearch
                                    options={[{ name: "Cả năm", value: 0 }, { name: "1", value: 1 }, { name: "2", value: 2 }]}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Không tìm thấy"
                                    placeholder=" "
                                    value={this.state.searchCondition.term}
                                    onChange={v => this.changeSearchCondition("term", v)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary ml-3" onClick={(e) => { e.preventDefault(); this.refresh() }}>Xem kết quả</button>
                        </form>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-primary mr-2">Xuất file</button>
                        <button type="button" className="btn btn-primary mr-2">In thống kê</button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 text-center statistic-title">
                        <div>
                            <b>Danh sách học sinh theo xếp hạng</b><br />
                            Trường Trung học cơ sở ABC
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <span className="mr-5 ml-5">
                            <b>Lớp: </b>
                        </span>
                        <span className="mr-5 ml-5">
                            <b>Học kỳ: </b>
                        </span>
                        <span className="mr-5 ml-5">
                            <b>Năm học: </b>
                        </span>
                        <span className="mr-5 ml-5">
                            <b>Giáo viên chủ nhiệm: </b>
                        </span>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered">
                            <thead className="text-center">
                                <tr>
                                    <th>Xếp hạng</th>
                                    <th>Họ tên</th>
                                    <th>Giới tính</th>
                                    <th>Điểm trung bình</th>
                                    <th>Hạnh kiểm</th>
                                    <th>Học lực</th>
                                    <th>Danh hiệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>1</td>
                                    <td>Nguyễn Thế Đức</td>
                                    <td>Nam</td>
                                    <td>9.0</td>
                                    <td>Tốt</td>
                                    <td>Giỏi</td>
                                    <td>Học sinh giỏi</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-3 mb-2 justify-content-end">
                    <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 text-center">
                        Hà Nội, ngày 15 tháng 05 năm 2021<br />
                        Giáo viên chủ nhiệm<br />
                        <br />
                        <br />
                        <br />
                        Bùi Minh Tuấn
                    </div>
                </div>

            </div>
        );
    }
}

export default withRouter(RankStatistic);
