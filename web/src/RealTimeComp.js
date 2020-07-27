import React from 'react';
import reactDOM from 'react-dom';
import HeaderComp from './HeaderComp';
import NavComp from './NavComp';
import FooterComp from './FooterComp';
import Realtime from './Realtime';


class RealTimeComp extends React.Component{
    render(){
        return (
            <div>
                <HeaderComp />
                <NavComp />
                <Realtime />
                <FooterComp />
            </div>
        );
    }
}

export default RealTimeComp;