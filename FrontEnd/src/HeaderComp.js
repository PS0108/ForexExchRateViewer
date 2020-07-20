import React from 'react';
import './Header.css'
import forex from './forex.jpg'

class HeaderComp extends React.Component{
    render(){
        return (
            <div className="Head">
            <header>
                <div>
                    <img src={forex} className="Head-img" alt="FOREX Historical Exchange Rates"/>
                </div>  

                <h1> FOREX Exchange Rates</h1>

            </header>
        </div>            );
    }
}

export default HeaderComp;