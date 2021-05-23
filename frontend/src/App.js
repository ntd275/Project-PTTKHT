import React from "react";
import AppContext from './context/AppContext';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

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
import StudentAssignment from './components/StudentAssignment/StudentAssignment';
import TransferClass from './components/TransferClass/TransferClass';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      context: {
      }
    }
  }
  render() {
    return (
      <AppContext.Provider value={this.state.context}>
        <BrowserRouter>
          <Header />
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/AccountInfo">
                <AccountInfo />
              </Route>
              <Route path="/forgetpassword">
                <ForgetPassword />
              </Route>
              <Route path="/ChangePassword">
                <ChangePassword />
              </Route>
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
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </AppContext.Provider>
    )
  }
}

export default App;
