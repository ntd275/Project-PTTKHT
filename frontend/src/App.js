import React from "react";
import AppContext from './context/AppContext';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css';
import ReactLoading from 'react-loading';

import Home from './components/Home/Home';
import Login from './components/Login/login';
import AccountInfo from './components/AccountInfo/AccountInfo';
import ForgetPassword from './components/ForgetPassword/forgetPassword';
import ChangePassword from './components/ChangePassword/ChangePassword';
import StudentScore from './components/StudentScore/StudentScore';
import StudentPLL from './components/StudentPLL/StudentPLL';
import RankStatistic from './components/Statistic/RankStatistic';
import SubjectStatistic from './components/Statistic/SubjectStatistic';
import TeachingClassScore from './components/TeachingClassScore/TeachingClassScore';
import ConductAssessment from './components/ConductAssessment/ConductAssessment';
import StudentAttendance from './components/StudentAttendance/StudentAttendance';
import ScoreLock from './components/ScoreLock/ScoreLock';
import HomeroomTeacherAssignment from './components/HomeroomTeacherAssignment/HomeroomTeacherAssignment';
import TeachingAssignment from './components/TeachingAssignment/TeachingAssignment';
import SpecialistAssignment from './components/SpecialistAssignment/SpecialistAssignment';
import SchoolYear from './components/SchoolYear/schoolYear';
import StudentAssignment from './components/StudentAssignment/StudentAssignment';
import TransferClass from './components/TransferClass/TransferClass';
import Api from './api/api';
import jwt from "jwt-decode";
import ReactNotification from 'react-notifications-component'
import Page404 from './components/Page404/Page404';
import Class from './components/Class/Class'
import Subject from './components/Subject/Subject'
import SpecialistTeam from './components/SpecialistTeam/SpecialistTeam'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      context: {
        user: null,
        setUser: this.setUser,
      },
      loading: true
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    let accessToken = localStorage.getItem('accessToken')
    //console.log(this.state.context.user)
    if (accessToken) {
      try {
        await Api.checkAuth()
        let user = jwt(accessToken)
        this.setUser(user)
      } catch (err) {
        console.log(err)
        this.setUser(null)
        //localStorage.removeItem('accessToken')
      }
    }
    this.setState({ loading: false })
  }

  setUser = (user) => {
    let context = this.state.context
    context.user = user
    this.setState({ context: context })
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="h-100 w-100 bg-primary d-flex justify-content-center">
          <ReactLoading type={"bars"} color={"#fff"} height={'20%'} width={'20%'} className="align-self-center mb-5" />
        </div >
      )
    }
    return (
      <AppContext.Provider value={this.state.context}>
        <BrowserRouter>
          <ReactNotification />
          <Header />
          <div className="content">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/forgetpassword">
                <ForgetPassword />
              </Route>
              <PrivateRouter exact path="/" component={<Home />} role={[2, 1, 0]} />
              <PrivateRouter path="/account-info" component={<AccountInfo />} role={[2, 1, 0]} />
              <PrivateRouter path="/change-password" component={<ChangePassword />} role={[2, 1, 0]} />
              <PrivateRouter path="/school-year" component={<SchoolYear />} role={[2]} />
              <PrivateRouter path="/class" component={<Class />} role={[2]} />
              <PrivateRouter path="/subject" component={<Subject />} role={[2]} />
              <PrivateRouter path="/specialist-team" component={<SpecialistTeam />} role={[2]} />
              <Route path="/student/score">
                <StudentScore />
              </Route>
              <Route path="/student/pll">
                <StudentPLL />
              </Route>
              {/* GVBM nhập điểm */}
              <Route path="/TeachingClassScore">
                <TeachingClassScore />
              </Route>
              {/* GVCN đánh giá hạnh kiểm */}
              <Route path="/ConductAssessment">
                <ConductAssessment />
              </Route>
              {/* GVCN điểm danh */}
              <Route path="/StudentAttendance">
                <StudentAttendance />
              </Route>
              {/* Phân công GVCN */}
              <Route path="/HomeroomTeacherAssignment">
                <HomeroomTeacherAssignment />
              </Route>
              {/* Phân công giảng dạy */}
              <Route path="/TeachingAssignment">
                <TeachingAssignment />
              </Route>
              {/* Phân công giáo viên vào tổ chuyên môn */}
              <Route path="/SpecialistAssignment">
                <SpecialistAssignment />
              </Route>
              {/* Quản lý học sinh trong lớp */}
              <Route path="/TransferClass">
                <TransferClass />
              </Route>
              {/* Kết chuyển lớp */}
              <Route path="/StudentAssignment">
                <StudentAssignment />
              </Route>
              <Route path="/statistic/rank">
                <RankStatistic />
              </Route>
              <Route path="/statistic/subject">
                <SubjectStatistic />
              </Route>
              {/* QTV khóa/mở nhập điểm */}
              <Route path="/scorelock">
                <ScoreLock />
              </Route>
              <Route path="/">
                <Page404 />
              </Route>
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </AppContext.Provider>
    )
  }
}

class PrivateRouter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }
  checkAuth = () => {
    //console.log(this.props, this.context, this.props.role && this.context.user && this.props.role.includes(this.context.user.role))
    return this.props.role && this.context.user && this.props.role.includes(this.context.user.role)
  }
  render() {
    let { component: Component, ...rest } = this.props;
    return (
      <Route {...rest}>
        {this.checkAuth() ?
          Component :
          <Redirect
            to={{
              pathname: '/login',
              state: { from: this.props.path }
            }}
          />
        }
      </Route>
    )
  }
}
PrivateRouter.contextType = AppContext

export default App;
