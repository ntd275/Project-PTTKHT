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
                                                    Tra c???u
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/student-score" className="dropdown-item">
                                        Tra c???u ??i???m
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/student-pll" className="dropdown-item">
                                        Tra c???u phi???u li??n l???c
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
                                            Xem th??ng tin t??i kho???n
                                    </Link>
                                        <NavDropdown.Divider />
                                        <Link to="/change-password" className="dropdown-item">
                                            ?????i m???t kh???u
                                    </Link>
                                        <NavDropdown.Divider />
                                        <div className="dropdown-item" onClick={this.logout}>
                                            ????ng xu???t
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
                                                    Ch???c n??ng
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/conduct-assesssment" className="dropdown-item">
                                        C???p nh???t ????nh gi?? h???nh ki???m
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/student-attendance" className="dropdown-item">
                                        ??i???m danh
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/pll" className="dropdown-item">
                                        Xu???t phi???u li??n l???c
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link
                                        to={{
                                            pathname: "/my-teaching-assignment-edit",
                                            state: { kind: "edit" }
                                        }}
                                        className="dropdown-item"
                                    >
                                        Nh???p ??i???m
                                    </Link>
                                </NavDropdown>
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <BiLineChart size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Th???ng k??
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/homeroom-statistic-rank" className="dropdown-item">
                                        Th??ng k?? danh s??ch theo h???ng
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/homeroom-statistic-subject" className="dropdown-item">
                                        Th???ng k?? k???t qu??? m??n h???c
                                    </Link>
                                    {/* <NavDropdown.Divider />
                                    <Link to="/" className="dropdown-item">
                                        Th???ng k?? ??i???m b??i thi theo c?? nh??n
                                    </Link> */}
                                </NavDropdown>
                                <NavDropdown
                                    title={
                                        <div className="d-inline-block">
                                            <div className="position-relative">
                                                <BsSearch size={this.state.iconSize} className="position-relative title-icon" />
                                                <div className="title-text d-inline-block">
                                                    Tra c???u
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    id="basic-nav-dropdown"
                                >
                                    <Link to="/search-homeroom-class-info" className="dropdown-item">
                                        Xem th??ng tin l???p ch??? nhi???m
                                    </Link>
                                    <NavDropdown.Divider />
                                    <Link
                                        to={{
                                            pathname: "/my-teaching-assignment",
                                            state: { kind: "info" }
                                        }}
                                        className="dropdown-item"
                                    >
                                        Tra c???u ??i???m c??c l???p gi???ng d???y
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
                                            Xem th??ng tin t??i kho???n
                                    </Link>
                                        <NavDropdown.Divider />
                                        <Link to="/change-password" className="dropdown-item">
                                            ?????i m???t kh???u
                                    </Link>
                                        <NavDropdown.Divider />
                                        <div className="dropdown-item" onClick={this.logout}>
                                            ????ng xu???t
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
                                                Danh m???c
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/school-year" className="dropdown-item">
                                    Qu???n l?? danh m???c n??m h???c
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/class" className="dropdown-item">
                                    Qu???n l?? danh m???c l???p h???c
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/subject" className="dropdown-item">
                                    Qu???n l?? danh m???c m??n h???c
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/specialist-team" className="dropdown-item">
                                    Qu???n l?? danh m???c t??? chuy??n m??n
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/student" className="dropdown-item">
                                    Qu???n l?? danh m???c h???c sinh
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/teacher" className="dropdown-item">
                                    Qu???n l?? danh m???c gi??o vi??n
                                </Link>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <FiMenu size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Ch???c n??ng
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/teaching-assignment" className="dropdown-item">
                                    Ph??n c??ng gi???ng d???y
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/homeroom-teacher-assignment" className="dropdown-item">
                                    Ph??n c??ng GVCN
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/specialist-assignment" className="dropdown-item">
                                    Ph??n c??ng t??? chuy??n m??n
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/student-assignment" className="dropdown-item">
                                    Qu???n l?? danh s??ch h???c sinh trong l???p
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/transfer-class" className="dropdown-item">
                                    K???t chuy???n l???p
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/account" className="dropdown-item">
                                    Qu???n l?? t??i kho???n
                                </Link>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <div className="d-inline-block">
                                        <div className="position-relative">
                                            <BiLineChart size={this.state.iconSize} className="position-relative title-icon" />
                                            <div className="title-text d-inline-block">
                                                Th???ng k??
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/statistic-rank" className="dropdown-item">
                                    Th??ng k?? danh s??ch theo h???ng
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/statistic-subject" className="dropdown-item">
                                    Th???ng k?? k???t qu??? m??n h???c
                                </Link>
                                {/* <NavDropdown.Divider />
                                <Link to="/" className="dropdown-item">
                                    Th???ng k?? ??i???m b??i thi theo c?? nh??n
                                </Link> */}
                            </NavDropdown>
                            <Link to="/score-lock" className="nav-link">
                                <div className="d-inline-block">
                                    <div className="position-relative">
                                        <BsFillLockFill size={this.state.iconSize} className="position-relative title-icon" />
                                        <div className="title-text d-inline-block">
                                            Kh??a/M??? nh???p ??i???m
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
                                                Tra c???u
                                            </div>
                                        </div>
                                    </div>
                                }
                                id="basic-nav-dropdown"
                            >
                                <Link to="/search-teacher" className="dropdown-item">
                                    Tra c???u th??ng tin gi??o vi??n
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-student" className="dropdown-item">
                                    Tra c???u th??ng tin h???c sinh
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-homeroom-teacher-assignment" className="dropdown-item">
                                    Tra c???u ph??n c??ng GVCN
                                </Link>
                                <NavDropdown.Divider />
                                <Link to="/search-teaching-assignment" className="dropdown-item">
                                    Tra c???u ph??n c??ng gi???ng d???y
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
                                        Xem th??ng tin t??i kho???n
                                </Link>
                                    <NavDropdown.Divider />
                                    <Link to="/change-password" className="dropdown-item">
                                        ?????i m???t kh???u
                                </Link>
                                    <NavDropdown.Divider />
                                    <div className="dropdown-item" onClick={this.logout}>
                                        ????ng xu???t
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