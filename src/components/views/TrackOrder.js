import React from 'react';
import {Link} from 'react-router-dom';


export default class TrackOrder extends React.Component {
 constructor(props)
 {   super(props)
    this.state = {
        orderNo: "",
        
      };
    
    
 }

 handleChange = e => this.setState({ orderNo: e.target.value });

    
   render () { 
     
    return(
      <> 
      
      
       <div className="track-sec">
       <h1>Track Your Order</h1>
       <input placeholder="Enter Order no." type="text" onChange={this.handleChange}></input>
       {
          window.location.href.includes('error') ? 
          
          <p> Incorrect Order Number </p> : null
        }
        
        <br /><Link to={"/orderDetail/" + this.state.orderNo} ><button>Track</button></ Link>
       
      </div> 
      
    
    </>
    )
   }
}
