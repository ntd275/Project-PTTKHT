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
import PLL from './components/PLL/PLL';
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
import Class from './components/Class/class'
import Subject from './components/Subject/subject'
import SpecialistTeam from './components/SpecialistTeam/specialistTeam'
import Student from './components/Student/student'
import Teacher from './components/Teacher/teacher'
import Account from './components/Account/Account'
import SearchTeacher from './components/SearchTeacher/SearchTeacher'
import SearchStudent from './components/SearchStudent/SearchStudent'
import SearchHomroomTeacherAssignment from './components/SearchHomroomTeacherAssignment/SearchHomroomTeacherAssignment'
import SearchTeachingAssignment from './components/SearchTeachingAssignment/SearchTeachingAssignment'
import MyTeachingAssignment from './components/MyTeachingAssignment/MyTeachingAssignment'
import HomeroomRankStatistic from './components/HomeRoomTeacherStatistic/RankStatistic'
import HomeroomSubjectStatistic from './components/HomeRoomTeacherStatistic/SubjectStatistic'
import SearchHomeroomClassInfo from './components/SearchHomeroomClassInfo/SearchHomeroomClassInfo'
import SearchScore from './components/SearchScore/SearchScore'
import StudentPLL from './components/StudentPLL/StudentPLL'
import MyTeachingAssignmentEdit from './components/MyTeachingAssignmentEdit/MyTeachingAssignmentEdit'
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
        localStorage.removeItem('accessToken')
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
              <PrivateRouter exact path="/account-info" component={<AccountInfo />} role={[2, 1, 0]} />
              <PrivateRouter exact path="/change-password" component={<ChangePassword />} role={[2, 1, 0]} />
              <PrivateRouter exact path="/school-year" component={<SchoolYear />} role={[2]} />
              <PrivateRouter exact path="/class" component={<Class />} role={[2]} />
              <PrivateRouter exact path="/subject" component={<Subject />} role={[2]} />
              <PrivateRouter exact path="/specialist-team" component={<SpecialistTeam />} role={[2]} />
              <PrivateRouter exact path="/student" component={<Student />} role={[2]} />
              <PrivateRouter exact path="/teacher" component={<Teacher />} role={[2]} />
              <PrivateRouter exact path="/teaching-assignment" component={<TeachingAssignment />} role={[2]} />
              <PrivateRouter exact path="/homeroom-teacher-assignment" component={<HomeroomTeacherAssignment />} role={[2]} />
              <PrivateRouter exact path="/specialist-assignment" component={<SpecialistAssignment />} role={[2]} />
              <PrivateRouter exact path="/student-assignment" component={<StudentAssignment />} role={[2]} />
              <PrivateRouter exact path="/account" component={<Account />} role={[2]} />
              <PrivateRouter exact path="/transfer-class" component={<TransferClass />} role={[2]} />
              <PrivateRouter exact path="/score-lock" component={<ScoreLock />} role={[2]} />
              <PrivateRouter exact path="/search-teacher" component={<SearchTeacher />} role={[2]} />
              <PrivateRouter exact path="/search-student" component={<SearchStudent />} role={[2]} />
              <PrivateRouter exact path="/search-homeroom-teacher-assignment" component={<SearchHomroomTeacherAssignment />} role={[2]} />
              <PrivateRouter exact path="/search-teaching-assignment" component={<SearchTeachingAssignment />} role={[2]} />
              <PrivateRouter exact path="/teaching-class-score" component={<TeachingClassScore />} role={[2, 1]} />
              <PrivateRouter exact path="/my-teaching-assignment" component={<MyTeachingAssignment />} role={[2, 1]} />
              <PrivateRouter exact path="/my-teaching-assignment-edit" component={<MyTeachingAssignmentEdit />} role={[2, 1]} />
              <PrivateRouter exact path="/conduct-assesssment" component={<ConductAssessment />} role={[2, 1]} />
              <PrivateRouter exact path="/statistic-rank" component={<RankStatistic />} role={[2]} />
              <PrivateRouter exact path="/statistic-subject" component={<SubjectStatistic />} role={[2]} />
              <PrivateRouter exact path="/student-score" component={<StudentScore />} role={[0]} />
              <PrivateRouter exact path="/homeroom-statistic-rank" component={<HomeroomRankStatistic />} role={[2, 1]} />
              <PrivateRouter exact path="/homeroom-statistic-subject" component={<HomeroomSubjectStatistic />} role={[2, 1]} />
              <PrivateRouter exact path="/search-homeroom-class-info" component={<SearchHomeroomClassInfo />} role={[2, 1]} />
              <PrivateRouter exact path="/search-score" component={<SearchScore />} role={[2, 1]} />
              <PrivateRouter exact path="/student-attendance" component={<StudentAttendance />} role={[2, 1]} />
              <PrivateRouter exact path="/pll" component={<PLL />} role={[2, 1]} />
              <PrivateRouter exact path="/student-pll" component={<StudentPLL />} role={[0]} />
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
  checkLogin = () => {
    return this.context.user
  }
  checkAuth = () => {
    return this.props.role && this.context.user && this.props.role.includes(this.context.user.role)
  }
  render() {
    let { component: Component, ...rest } = this.props;
    return (
      <Route {...rest}>
        {this.checkLogin() ?
          this.checkAuth() ?
            Component :
            <Redirect
              to='/'
            /> :
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
