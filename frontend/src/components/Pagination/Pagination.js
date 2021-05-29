import React from "react";
import {
    BsChevronRight,
    BsChevronLeft,
    BsChevronDoubleRight,
    BsChevronDoubleLeft,
} from "react-icons/bs"
import '../../css/pagination.css'
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    beginPage = () => {
        if (this.props.pagination.currentPage !== 1) {
            return (
                <li className="page-item" onClick={() => this.props.changePage(1)}>
                    <div className="page-link">
                        <BsChevronDoubleLeft />
                    </div>
                </li>
            )
        }
        return (
            <li className="page-item disabled">
                <div className="page-link">
                    <BsChevronDoubleLeft />
                </div>
            </li>
        )
    }

    prePage = () => {
        if (this.props.pagination.currentPage !== 1) {
            return (
                <li className="page-item" onClick={() => this.props.changePage(this.props.pagination.currentPage - 1)} >
                    <div className="page-link ">
                        <BsChevronLeft />
                    </div>
                </li>
            )
        }
        return (
            <li className="page-item disabled">
                <div className="page-link ">
                    <BsChevronLeft />
                </div>
            </li>
        )
    }

    nextPage = () => {
        if (this.props.pagination.currentPage !== this.props.pagination.lastPage) {
            return (
                <li className="page-item" onClick={() => this.props.changePage(this.props.pagination.currentPage + 1)} >
                    <div className="page-link">
                        <BsChevronRight />
                    </div>
                </li>
            )
        }
        return (
            <li className="page-item disabled">
                <div className="page-link ">
                    <BsChevronRight />
                </div>
            </li>
        )
    }

    lastPage = () => {
        if (this.props.pagination.currentPage !== this.props.pagination.lastPage) {
            return (
                <li className="page-item" onClick={() => this.props.changePage(this.props.pagination.lastPage)}>
                    <div className="page-link">
                        <BsChevronDoubleRight />
                    </div>
                </li>
            )
        }
        return (
            <li className="page-item disabled">
                <div className="page-link">
                    <BsChevronDoubleRight />
                </div>
            </li>
        )
    }

    pageList = () => {
        let start = this.props.pagination.currentPage > 5 ? this.props.pagination.currentPage - 5 : 1
        let end = this.props.pagination.currentPage < this.props.pagination.lastPage - 5 ? this.props.pagination.currentPage + 5 : this.props.pagination.lastPage
        let list = []
        for (let i = start; i <= end; i++) {
            if (i === this.props.pagination.currentPage) {
                list.push(
                    <li className="page-item disabled" key={i}>
                        <div className="page-link page-element">{i}</div>
                    </li>
                )
                continue
            }
            list.push(
                <li className="page-item" key={i} onClick={() => this.props.changePage(i)}>
                    <div className="page-link page-element">{i}</div>
                </li>
            )
        }
        return list
    }

    render() {
        //console.log(this.props)
        return (
            <div>
                <nav aria-label="Pagination">
                    <ul className="pagination">
                        {this.beginPage()}
                        {this.prePage()}
                        {this.pageList()}
                        {this.nextPage()}
                        {this.lastPage()}
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Pagination