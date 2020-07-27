import React from 'react';
import reactDOM from 'react-dom';
import HeaderComp from './HeaderComp';
import NavComp from './NavComp';
import HomeContent from './HomeContent';
import FooterComp from './FooterComp';

class Home extends React.Component{
    render(){
        return (
            <div>
                <HeaderComp />
                <NavComp />
                <HomeContent />
                <FooterComp />
            </div>
            );
    }
}

export default Home;