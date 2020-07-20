import React from 'react';
import { NavLink, HashRouter, BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route, Link } from "react-router-dom";
import "./NavComp.css"

class NavComp extends React.Component{
    render(){
        return (
            <div className="topnav">
                    <nav>
                        <NavLink to="/" class="Home"> Home </NavLink>
                        <NavLink to="/historical" class="HistData">    Historical-Data    </NavLink>
                        <NavLink to="/realtime" class="RealTime">   Real-Time Data   </NavLink>
                        <NavLink to="/changerate" class="RateChange">   Change-Rate   </NavLink>
                    </nav>
            </div>

            );
    }
}

export default NavComp;