import React from "react";
import AppContext from './context/AppContext'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css'

import Login from './components/Login/login'
import ForgetPassword from './components/ForgetPassword/forgetPassword'
import Api from "./api/api";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      context: {
        user: null,
        setUser: this.setUser,
      }
    }
  }

  async componentDidMount() {
    let accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      try {
        //await Api.checkAuth()
        //let user = jwt.decode(accessToken)
        //fake user
        let user = {
          accountName: "Duc",
          role: 1,
        }
        this.setUser(user)
      } catch (err) {
        console.log(err)
        localStorage.removeItem('accessToken')
      }
    }
  }

  setUser = (user) => {
    let context = this.state.context
    context.user = user
    this.setState({ context: context })
  }

  render() {
    return (
      <AppContext.Provider value={this.state.context}>
        <BrowserRouter>
          <Header />
          <div className="content">
            <Switch>
              {/* <Route exact path="/">
                <Home />
              </Route> */}
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/forgetpassword">
                <ForgetPassword />
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
