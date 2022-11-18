import React from "react";
import './FullInfoModal.css';



const FullInfoModal = (props) => {




  return <div id="Full_info_modal" className="Full_info_modal hidden" >
    <button onClick={()=>{document.getElementById("Full_info_modal").classList.add("hidden")}}>✕</button>
    <div id="Full_info_modal_div" className="Full_info_modal_div" >
    
    </div>
  </div>;



};

export default FullInfoModal;
