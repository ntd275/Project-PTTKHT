import React from "react";
import { BiCopyright } from "react-icons/bi"

class Footer extends React.Component {
    render() {
        return (
            <footer className="border-top text-center">
                <div className="container-fluid">
                    <div className="row ">
                        <div className="col text-center">
                            <BiCopyright /> Trường THCS ABC
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col text-right">
                            Email: <a href="mailto:xyz@gmail.com">xyz@gmail.com</a>
                        </div>
                        <div className="col text-left">
                            Phone: <a href="tel:0123456789">0123456789</a>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer