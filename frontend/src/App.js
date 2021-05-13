import React from "react";
import AppContext from './context/AppContext'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css'

import Login from './components/Login/login'

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
              {/* <Route exact path="/">
                <Home />
              </Route> */}
              <Route path="/login">
                <Login />
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
