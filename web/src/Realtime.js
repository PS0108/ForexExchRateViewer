import React from 'react';
import reactDOM from 'react-dom';
import "./Historical.css"

const RenderLiveData = (props) => {
    var out = ''
         
    if (typeof(props.rateobj) == 'undefined' )
        return <div></div>
  
    //if (typeof(props.rateobj.data[props.currpair]) == 'undefined' )      
      //  return <div></div>
  
        return(
          <div className="ContentDiv">
            <p className="MainDiv"><h4>Live FOREX Rates</h4></p>
            <table border={1} cellPadding={5} className="tableDiv">
  
            <thead>
              <tr>
                <td>Currency Pair</td>
                <td>Rate</td>
              </tr>
            </thead>
  
            <tbody>
            {
                   Object.keys(props.rateobj).map((key, i) => (
                  <tr key={i}>
                    <td>{key}</td>
                    <td>{props.rateobj[key]}</td>
                  </tr>
                )
            )
            }
            </tbody>
            </table>   
          </div>
        )
  
  }

class Realtime extends React.Component{

        constructor(props) {
          super(props);
          this.state = {
            error: null,
            isLoaded: false,
            items: {},
            currencies: ''
          };
        }
        async componentDidMount() {
            this.timer = setInterval(() => this.apicall(), 500000)
        }

        async apicall() {
          //const  currencies = "EURUSD,GBPUSD,USDJPY,AUDUSD,USDEUR,USDGBP,USDJPY,JPYUSD,EURGBP,EURAUD"
        if(this.state.currencies == ''){
            fetch("/currencies")
            .then(res => res.json())
            .then(
                (result) => {
                this.setState({currencies: result})
                console.log(this.state.currencies)
                });
            }

          fetch("https://fxmarketapi.com/apilive?api_key=API_KEY&currency=" + this.state.currencies)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  isLoaded: true,
                  items: result.price
                });
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              }
            )
        }
      
        render() {
          const { error, isLoaded, items } = this.state;
          if (error) {
            //return <div>Error: {error.message}</div>;
            return <div className="ContentDiv"></div>;
          } else if (!isLoaded) {
            return <div className="ContentDiv"></div>;
          } else {
            return (
                <RenderLiveData rateobj={items} />
            );
        }
    }
 }

export default Realtime;