import React from 'react';
import Realtime from './Realtime';
import HeaderComp from './HeaderComp';
import NavComp from './NavComp';

import FooterComp from './FooterComp';
import HistForm from './HistForm';


class HistContent extends React.Component{
    render(){
        return (
            <div>
                <HeaderComp />
                <NavComp />
                <HistForm />
                <FooterComp />
            </div>
            );
    }
}

export default HistContent;