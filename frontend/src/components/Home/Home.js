import React, { Component } from "react";
import '../../css/Home.css';

class Home extends Component {
    
    render() {
        return (
            <div className="container">
                <div className="row" style={{ marginTop: "150px" }}>
                    <div className="col-12 text-center panel-home">
                        <div className="shadow">
                            Hệ thống sổ liên lạc điện tử <br />
                            Trường Trung học cơ sở ABC
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
