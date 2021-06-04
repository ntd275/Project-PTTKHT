import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { FaHome, FaUserCircle } from 'react-icons/fa'
import { BsGrid3X3Gap, BsFillLockFill, BsSearch } from 'react-icons/bs'
import { FiMenu } from 'react-icons/fi'
import { BiLineChart } from 'react-icons/bi'
import '../../css/Header.css'
import AppContext from '../../context/AppContext'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            iconSize: 20
        }
    }

    logout = async () => {
        try {
            //await api.logout()
            localStorage.removeItem('accessToken')
            this.context.setUser(null)
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        if (!this.context.user) {
            return (
                <header>
                    <Navbar bg="primary" expand="lg" variant="dark">
                        <Link to="/" className="navbar-brand">
                            <FaHome size={this.state.iconSize * 1.5} />
                        </Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </Navbar>
                </header>
            )
        }
        if (this.context.user.role === 0) {
            return (
                <header>
                    <Navbar bg="primary" expand="lg" variant="dark">
                        <Link to="/" className="navbar-brand">
                            <FaHome size={this.state.iconSize * 1.5} />
                        </Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <BsSearch size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Tra cứu
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/student-score" className="dropdown-item">
                                        Tra cứu điểm
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/student-pll" className="dropdown-item">
                                        Tra cứu phiếu liên lạc
                                    </Link>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                {this.context.user &&
                                    <NavDropdown
                                        alignRight
                                        title={
                                            <div className="d-inline-block">
                                                <div className="position-relative">
                                                    <FaUserCircle size={this.state.iconSize} className="position-relative title-icon" />
                                                    <div className="title-text d-inline-block">
                                                        {this.context.user && this.context.user.accountName}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        id="basic-nav-dropdown"
                                    >
                                        <Link to="/account-info" className="dropdown-item">
                                            Xem thông tin tài khoản
                                    </Link>
                                        <NavDropdown.Divider />
                                        <Link to="/change-password" className="dropdown-item">
                                            Đổi mật khẩu
                                    </Link>
                                        <NavDropdown.Divider />
                                        <div className="dropdown-item" onClick={this.logout}>
                                            Đăng xuất
                                    </div>
                                    </NavDropdown>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
            )
        }

        if (this.context.user.role === 1) {
            return (
                <header>
                    <Navbar bg="primary" expand="lg" variant="dark">
                        <Link to="/" className="navbar-brand">
                            <FaHome size={this.state.iconSize * 1.5} />
                        </Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <FiMenu size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Chức năng
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/conduct-assesssment" className="dropdown-item">
                                        Cập nhật đánh giá hạnh kiểm
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/student-attendance" className="dropdown-item">
                                        Điểm danh
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/pll" className="dropdown-item">
                                        Xuất phiếu liên lạc
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link
                                        to={{
                                            pathname: "/my-teaching-assignment-edit",
                                            state: { kind: "edit" }
                                        }}
                                        className="dropdown-item"
                                    >
                                        Nhập điểm
                                    </Link>
                                </NavDropdown>
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <BiLineChart size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Thống kê
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/homeroom-statistic-rank" className="dropdown-item">
                                        Thông kê danh sách theo hạng
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/homeroom-statistic-subject" className="dropdown-item">
                                        Thống kê kết quả môn học
                                    </Link>
                                    {/* <NavDropdown.Divider />
                                    <Link to="/" className="dropdown-item">
                                        Thống kê điểm bài thi theo cá nhân
                                    </Link> */}
                                </NavDropdown>
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <BsSearch size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Tra cứu
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/search-homeroom-class-info" className="dropdown-item">
                                        Xem thông tin lớp chủ nhiệm
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link
                                        to={{
                                            pathname: "/my-teaching-assignment",
                                            state: { kind: "info" }
                                        }}
                                        className="dropdown-item"
                                    >
                                        Tra cứu điểm các lớp giảng dạy
                                    </Link>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                {this.context.user &&
                                    <NavDropdown
                                        alignRight
                                        title={
                                            <div className="d-inline-block">
                                                <div className="position-relative">
                                                    <FaUserCircle size={this.state.iconSize} className="position-relative title-icon" />
                                                    <div className="title-text d-inline-block">
                                                        {this.context.user && this.context.user.accountName}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        id="basic-nav-dropdown"
                                    >
                                        <Link to="/account-info" className="dropdown-item">
                                            Xem thông tin tài khoản
                                    </Link>
                                        <NavDropdown.Divider />
                                        <Link to="/change-password" className="dropdown-item">
                                            Đổi mật khẩu
                                    </Link>
                                        <NavDropdown.Divider />
                                        <div className="dropdown-item" onClick={this.logout}>
                                            Đăng xuất
                                    </div>
                                    </NavDropdown>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header >
            )
        }
        return (
            <header>
                <Navbar bg="primary" expand="lg" variant="dark">
                    <Link to="/" className="navbar-brand">
                        <FaHome size={this.state.iconSize * 1.5} />
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <BsGrid3X3Gap size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Danh mục
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/school-year" className="dropdown-item">
                                    Quản lý danh mục năm học
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/class" className="dropdown-item">
                                    Quản lý danh mục lớp học
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/subject" className="dropdown-item">
                                    Quản lý danh mục môn học
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/specialist-team" className="dropdown-item">
                                    Quản lý danh mục tổ chuyên môn
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/student" className="dropdown-item">
                                    Quản lý danh mục học sinh
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/teacher" className="dropdown-item">
                                    Quản lý danh mục giáo viên
                                </Link>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <FiMenu size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Chức năng
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/teaching-assignment" className="dropdown-item">
                                    Phân công giảng dạy
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/homeroom-teacher-assignment" className="dropdown-item">
                                    Phân công GVCN
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/specialist-assignment" className="dropdown-item">
                                    Phân công tổ chuyên môn
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/student-assignment" className="dropdown-item">
                                    Quản lý danh sách học sinh trong lớp
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/transfer-class" className="dropdown-item">
                                    Kết chuyển lớp
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/account" className="dropdown-item">
                                    Quản lý tài khoản
                                </Link>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <BiLineChart size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Thống kê
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/statistic-rank" className="dropdown-item">
                                    Thông kê danh sách theo hạng
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/statistic-subject" className="dropdown-item">
                                    Thống kê kết quả môn học
                                </Link>
                                {/* <NavDropdown.Divider />
                                <Link to="/" className="dropdown-item">
                                    Thống kê điểm bài thi theo cá nhân
                                </Link> */}
                            </NavDropdown>
                            <Link to="/score-lock" className="nav-link">
                                <div className="d-inline-block">
                                    <div className="position-relative">
                                        <BsFillLockFill size={this.state.iconSize} className="position-relative title-icon" />
                                        <div className="title-text d-inline-block">
                                            Khóa/Mở nhập điểm
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <BsSearch size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Tra cứu
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/search-teacher" className="dropdown-item">
                                    Tra cứu thông tin giáo viên
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-student" className="dropdown-item">
                                    Tra cứu thông tin học sinh
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-homeroom-teacher-assignment" className="dropdown-item">
                                    Tra cứu phân công GVCN
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-teaching-assignment" className="dropdown-item">
                                    Tra cứu phân công giảng dạy
                                </Link>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            {this.context.user &&
                                <NavDropdown
                                    alignRight
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <FaUserCircle size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    {this.context.user && this.context.user.accountName}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/account-info" className="dropdown-item">
                                        Xem thông tin tài khoản
                                </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/change-password" className="dropdown-item">
                                        Đổi mật khẩu
                                </Link>
                                    <NavDropdown.Divider />
                                    <div className="dropdown-item" onClick={this.logout}>
                                        Đăng xuất
                                </div>
                                </NavDropdown>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }
}

Header.contextType = AppContext

export default Header