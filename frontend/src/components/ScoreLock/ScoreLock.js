import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../api/api";
import '../../css/ScoreLock.css';

class ScoreLock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolYearList: ["2020-2021", "2019-2020", "2018-2019", "2017-2018"],
            term: 1,
            lockStateList: ["Khóa", "Mở"],
            lockState: 0,
        };
    }
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value }, () => {
            console.log(this.state);
        }); 
    }
    changeStateHandler = () => {
        let currentState = this.state.lockState;
        this.setState({
            lockState: 1-currentState
        });
    }
    render() {
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <table className="table table-bordered">
                            <thead className="text-center">
                                <tr>
                                    <th>STT</th>
                                    <th>Năm học</th>
                                    <th>Kì học</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center school-year-row">
                                    <td>1</td>
                                    <td>2020-2021</td>
                                    <td>
                                        <select className="cell" name="term" onChange={e => this.changeHandler(e)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>    
                                    </td>
                                    <td>{this.state.lockStateList[this.state.lockState]}</td>
                                    <td>
                                        <button type="button" onClick={e => this.changeStateHandler(e)}>{this.state.lockStateList[1-this.state.lockState]}</button>
                                    </td>
                                </tr>
                                <tr className="text-center school-year-row">
                                    <td>1</td>
                                    <td>2020-2021</td>
                                    <td>
                                        <select className="cell" name="term">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>    
                                    </td>
                                    <td>{this.state.lockStateList[this.state.lockState]}</td>
                                    <td>
                                        <button type="button">{this.state.lockStateList[1-this.state.lockState]}</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScoreLock;
