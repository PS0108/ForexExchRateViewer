import React from 'react';

import HeaderComp from './HeaderComp';
import NavComp from './NavComp';

import FooterComp from './FooterComp';
import ChangeRate from './ChangeRate';


class RateChangeComp extends React.Component{
    render(){
        return (
            <div>
                <HeaderComp />
                <NavComp />
                <ChangeRate />
                <FooterComp />
            </div>
            );
    }
}

export default RateChangeComp;