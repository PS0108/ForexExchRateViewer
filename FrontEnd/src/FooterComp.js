import React from 'react';
import { isMoment } from 'moment';
import './Footer.css'

class FooterComp extends React.Component{
    render(){
        return (
            <div className="ffoot">
                <footer>
                    <h6>Copyright &#169; Forex Currency Exchange Rates. All rights reserved.</h6>
                </footer>
            </div>
        )
    }
}

export default FooterComp;