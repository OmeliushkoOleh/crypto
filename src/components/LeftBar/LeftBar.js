import React from "react";
import "./LeftBar.css"

const Left_bar = () => {


  return (
  <div className="left_bar">

    <div onClick={()=>{window.scrollTo(0,0)}}className="left_bar_item" >Up</div>

    <div className="left_bar_item" >Item 1</div>
    <div className="left_bar_item" >Item 1</div>
    <div className="left_bar_item" >Item 1</div>
    
    
    <div onClick={()=>{window.scrollTo(0,100000)}}className="left_bar_item" >Down</div>

  </div>
  )
};

export default Left_bar;
