import React, { Component } from "react";
import Api from "../../api/api";
import '../../css/Statistic/RankStatistic.css';
import { store } from 'react-notifications-component';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { BsArrowLeftShort } from 'react-icons/bs'
import { withRouter } from 'react-router-dom'
import AppContext from '../../context/AppContext'
import Pdf from "react-to-pdf";
import ReactToPrint from 'react-to-print';
const ref = React.createRef()

class RankStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: [],
            classList: [],
            searchCondition: {},
            iconSize: '15px',
            homeroomTeacher: "",
            studentList: [],
            date: new Date()
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        try {
            let [schoolYearList, teacher] = await Promise.all([
                Api.getSchoolYearList(1, 1000000),
                Api.getTeacherByCode(this.context.user.userCode)
            ]);
            let searchCondition = {
                schoolYearId: schoolYearList.data.result.data[schoolYearList.data.result.data.length - 1].schoolYearId,
                term: 1,
                teacherId: teacher.data.result.teacherId,
            }
            let homeroomClass = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
            if (homeroomClass.data.result.data.length) {
                searchCondition.classId = homeroomClass.data.result.data[0].classId
            }
            console.log(searchCondition)
            this.setState({
                classList: homeroomClass.data.result.data,
                schoolYearList: schoolYearList.data.result.data,
                searchCondition: searchCondition,
                loading: false
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Th??ng b??o",
                    message: "Danh s??ch r???ng",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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
        this.setState({ loading: true, showReport: false })
        try {
            if (!this.state.searchCondition.classId) {
                store.addNotification({
                    title: "Th??ng b??o",
                    message: "B???n kh??ng l?? gi??o vi??n ch??? nhi???m l???p trong n??m h???c n??y",
                    type: "info",
                    container: "top-center",
                    dismiss: {
                        duration: 5000,
                        showIcon: true,
                    },
                    animationIn: ["animate__backInDown", "animate__animated"],
                    animationOut: ["animate__fadeOutUp", "animate__animated"],
                })
                this.setState({ loading: false, showReport: false })
                return
            }
            let res = await Api.getRankReport(1, 1000000, searchCondition || this.state.searchCondition)
            console.log(res)
            this.setState({
                showReport: true,
                loading: false,
                studentList: res.data.data,
                homeroomTeacher: res.data.homeroomTeacher,
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
            if (err.response && err.response.status === 400) {
                store.addNotification({
                    title: "Th??ng b??o",
                    message: "Danh s??ch r???ng",
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
                title: "H??? th???ng c?? l???i",
                message: "Vui l??ng li??n h??? qu???n tr??? vi??n ho???c th??? l???i sau",
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

    changeSearchCondition = async (name, value) => {
        //console.log(name, value)
        let searchCondition = this.state.searchCondition
        searchCondition[name] = value
        if (name === "schoolYearId") {
            this.setState({ loading: true, showReport: false })
            searchCondition.classId = undefined;
            try {
                let classList = await Api.searchHomeroomTeacherAssignment(1, 1000000, searchCondition)
                if (classList.data.result.data.length) {
                    searchCondition.classId = classList.data.result.data[0].classId
                }
                this.setState({
                    loading: false,
                    classList: classList.data.result.data,
                    searchCondition: searchCondition,
                })
            } catch (err) {
                this.setState({
                    loading: false,
                    classList: [],
                    searchCondition: searchCondition,
                })
                console.log(err)
            }
        }
    }

    renderTableData() {
        let sttBase = 1
        return this.state.studentList.map((data, index) => {
            const { studentName, gender, address, avgScore, scoreLevel, conduct } = data;
            return (
                <tr key={index}>
                    <td>{sttBase + index}</td>
                    <td>{studentName}</td>
                    <td>{gender === 1 ? "Nam" : "N???"}</td>
                    <td>{avgScore}</td>
                    <td>{conduct}</td>
                    <td>{scoreLevel}</td>
                    <td>{address}</td>
                </tr>
            );
        });
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
                <div className="row">
                    <div className="col align-self-center d-flex">
                        <div className="align-self-center">
                            <BsArrowLeftShort size={50} onClick={this.back} />
                        </div>
                        <div className="h3 align-self-center mb-0">
                            Th???ng k?? danh s??ch theo h???ng
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-9">
                        <form className="form-inline" onSubmit={e => this.submitHandler(e)}>
                            <label>N??m h???c:</label>
                            <div className="ml-1 select-school-year">
                                <SelectSearch
                                    options={this.getSchoolYearOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Kh??ng t??m th???y"
                                    placeholder=" "
                                    value={this.state.searchCondition.schoolYearId}
                                    onChange={v => this.changeSearchCondition("schoolYearId", v)}
                                />
                            </div>
                            <label className="ml-2">L???p:</label>
                            <div className="ml-1 select-class">
                                <SelectSearch
                                    options={this.getClassOption()}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Kh??ng t??m th???y"
                                    placeholder=" "
                                    value={this.state.searchCondition.classId}
                                    onChange={v => this.changeSearchCondition("classId", v)}
                                    disabled={true}
                                />
                            </div>
                            <label className="ml-2">H???c k???:</label>
                            <div className="ml-1 select-term">
                                <SelectSearch
                                    options={[{ name: "C??? n??m", value: 0 }, { name: "1", value: 1 }, { name: "2", value: 2 }]}
                                    search
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Kh??ng t??m th???y"
                                    placeholder=" "
                                    value={this.state.searchCondition.term}
                                    onChange={v => this.changeSearchCondition("term", v)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary ml-3" onClick={(e) => { e.preventDefault(); this.refresh() }}>Xem k???t qu???</button>
                        </form>
                    </div>
                    {this.state.showReport &&
                        <div className="col-3">
                            <Pdf targetRef={ref} filename="rank-report.pdf" scale={0.7} y={7}>
                                {({ toPdf }) => <button type="button" className="btn btn-primary mr-2" onClick={toPdf}>Xu???t file</button>}
                            </Pdf>
                            <ReactToPrint
                                trigger={() => {

                                    return <button type="button" className="btn btn-primary mr-2">In th???ng k??</button>;
                                }}
                                content={() => this.componentRef}
                            />
                        </div>
                    }
                </div>
                <hr />
                {this.state.showReport &&
                    <div ref={ref} style={{ overflow: "auto" }} >
                        <div id="report" ref={el => (this.componentRef = el)} className="container-fluid" style={{ width: "280mm" }}>
                            <div className="row">
                                <div className="col-12 text-center statistic-title">
                                    <div>
                                        <b>Danh s??ch h???c sinh theo x???p h???ng</b><br />
                            Tr?????ng Trung h???c c?? s??? ABC
                        </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                                    <span className="mr-5 ml-5">
                                        <b>L???p: </b> {this.state.classList.find(e => e.classId === this.state.searchCondition.classId) && this.state.classList.find(e => e.classId === this.state.searchCondition.classId).className}
                                    </span>
                                    <span className="mr-5 ml-5">
                                        <b>H???c k???: </b> {this.state.searchCondition.term === 0 ? "C??? n??m" : this.state.searchCondition.term}
                                    </span>
                                    <span className="mr-5 ml-5">
                                        <b>N??m h???c: </b> {this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId) && this.state.schoolYearList.find(e => e.schoolYearId === this.state.searchCondition.schoolYearId).schoolYear}
                                    </span>
                                    <span className="mr-5 ml-5">
                                        <b>Gi??o vi??n ch??? nhi???m: </b> {this.state.homeroomTeacher}
                                    </span>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <table className="table table-bordered">
                                        <thead className="text-center">
                                            <tr>
                                                <th>X???p h???ng</th>
                                                <th>H??? t??n</th>
                                                <th>Gi???i t??nh</th>
                                                <th>??i???m trung b??nh</th>
                                                <th>H???nh ki???m</th>
                                                <th>H???c l???c</th>
                                                <th>Danh hi???u</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderTableData()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="row mt-3 mb-2 justify-content-end">
                                <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 text-center">
                                    H?? N???i, ng??y {this.state.date.getDate()} th??ng {this.state.date.getMonth() + 1} n??m {this.state.date.getFullYear()}<br />
                        Gi??o vi??n ch??? nhi???m<br />
                                    <br />
                                    <br />
                                    <br />
                                    {this.state.homeroomTeacher}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

RankStatistic.contextType = AppContext

export default withRouter(RankStatistic);
