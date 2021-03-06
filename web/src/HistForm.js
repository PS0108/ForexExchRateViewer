import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';
import './Historical.css'


const RenderHistData = (props) => {
  var out = ''
       
  if (typeof(props.rateobj.data) == 'undefined' )
      return <div></div>

  if (typeof(props.rateobj.data[props.currpair]) == 'undefined' )      
      return <div></div>

      return(
        <div>
          <p>The Historical Currency Exchange Rate for {props.currpair}</p>
          <table border={1} cellPadding={5}  className="tableDiv">

          <thead>
            <tr>
              <td>Date</td>
              <td>Exchange Rate</td>
            </tr>
          </thead>

          <tbody>
          {
            	 Object.keys(props.rateobj.data[props.currpair]).map((key, i) => (
                <tr key={i}>
                  <td>{key}</td>
                  <td>{props.rateobj.data[props.currpair][key]}</td>
                </tr>
              )
          )
          }
          </tbody>
          </table>   
        </div>
      )

}


class HistForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
            base_currency: 'USD',
            target_currency: 'EUR',
            from: new Date(),
            to: new Date(),
            rateInfo:  {},
            currencies: ''
        };
      }
      mySubmitHandler = (event) => {
        event.preventDefault();

        const from_curr = encodeURIComponent(this.state.base_currency);
        const to_curr = encodeURIComponent(this.state.target_currency);
        const from_date = Moment(this.state.from).format('YYYY-MM-DD')
        const to_date = Moment(this.state.to).format('YYYY-MM-DD')
        const curr_pair=from_curr+to_curr
        fetch("/histReq?FROM_CURR="+from_curr+"&TO_CURR="+to_curr+"&FROM_DATE="+from_date+"&TO_DATE="+to_date)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({rateInfo: result})
            console.log(this.state.rateInfo)
            
            });
      }
      
      handleChange = (date,name) => {
        this.setState({[name]: date });
      };

      currHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
      }

      render() {

        if(this.state.currencies.length == 0){
          fetch("/currencies")
          .then(res => res.json())
          .then(
              (result) => {
              this.setState({currencies: result})
              console.log(this.state.currencies)
              });
          }
        
        const curr_pair = this.state.base_currency + this.state.target_currency;
        
        var lists = this.state.currencies.split(',')
        
        const sublist = lists.map((curr) =>
            curr.substr(0,3) 
        );
        const newlist = Array.from(new Set(sublist))
        const listItems = newlist.map((curr) =>          
          <option value={curr}>{curr.substr(0,3)}</option>
          ); 
      
        return (
            <div className="MainDiv">
              <header><h3>Historical Currency Exchange Rate Viewer</h3></header>
              <form onSubmit={this.mySubmitHandler}>
              <p><h4>Choose Currency Pair</h4></p>

              <div className="selectDivLeft">
              <label name="From">Base   </label>
              <select name='base_currency' value={this.state.base_currency} onChange = {this.currHandler}>
                    {listItems}
              </select>          
              </div>
              <div className="selectDivRight">
                <label name="To">Target  </label>
              <select name='target_currency' value={this.state.target_currency} onChange = {this.currHandler}>
                    {listItems}
              </select>          
              </div>
              
              <div className="row">
              <p><h4>Choose Reporting Period</h4></p>
                  <div className="left">
                      <label>From  </label>
                      <DatePicker 
                          dateFormat="yyyy/MM/dd"
                          name='from' 
                          selected={this.state.from} 
                          onChange={(date)=>this.handleChange(date, 'from')} 
                          placeholderText="From" 
                          closeOnScroll={true}  
                          isClearable
                      />
                  </div>

                  <div className="right">
                      <label>To  </label>
                      <DatePicker 
                          dateFormat="yyyy/MM/dd"
                          name='to' 
                          selected={this.state.to}  
                          onChange={(date)=>this.handleChange(date, 'to')} 
                          placeholderText="To" 
                          closeOnScroll={true} 
                          isClearable
                      />
                  </div>
              </div>

              <div className="Button">
                <br></br>
                <input type='submit' value="Retrieve Historical Data"  />
              </div>


              </form>

              <RenderHistData rateobj={this.state.rateInfo} currpair={curr_pair}/>
              
          </div>
      );
      }
}

export default HistForm;