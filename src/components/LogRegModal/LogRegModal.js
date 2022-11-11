import React, { useRef } from "react";
import './LogRegModal.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';

const LogRegModal = () => {

  const input_log_email = React.useRef("")
  const input_log_password = React.useRef("")

  const input_reg_email = React.useRef("")
  const input_reg_password = React.useRef("")
  const input_reg_re_password = React.useRef("")


  const [alignment, setAlignment] = React.useState('log');

  const handleChange = (event,newAlignment,) => {setAlignment(newAlignment)};


  const handlechoose = (button)=>{
    if(button == "log"){
      document.getElementById("log_inputs").classList.remove("hidden");
      document.getElementById("reg_inputs").classList.add("hidden");

      document.getElementById("logButton").setAttribute("style", `backgroundColor:"red"`);
      document.getElementById("regButton").classList.remove("active");
    } else{
      document.getElementById("reg_inputs").classList.remove("hidden");
      document.getElementById("log_inputs").classList.add("hidden");

      document.getElementById("regButton").classList.add("active");
      document.getElementById("logButton").classList.remove("active");
    }
  }

  const sendLogInfo = ()=>{
    console.log(input_log_email.current.value)
    console.log(input_log_password.current.value)
  }
  
  const sendRegInfo = ()=>{
    console.log(input_reg_email.current.value)
    console.log(input_reg_password.current.value)
    console.log(input_reg_re_password.current.value)
  }


  return <div id="log_reg_modal" className="log_reg_modal hidden" onClick={()=>{document.getElementById("log_reg_modal").classList.toggle("hidden")}}>
    
    <div className="log_reg_container" onClick={(e)=>{e.preventDefault();e.stopPropagation();}} >

      <div className="log_reg_choose">
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton id="logButton" value="log" onClick={()=>{handlechoose("log")}}>Log</ToggleButton>
          <ToggleButton id="regButton" value="reg" onClick={()=>{handlechoose("reg") }}>Reg</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="inputs">
        <div id="log_inputs" className="log_inputs">
          <form>
            <input ref={input_log_email} type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"></input>
            <br/>
            
            <input ref={input_log_password} type="password" className="form-control" placeholder="Password" autoComplete="on"suggested="current-password"aria-label="Password" aria-describedby="basic-addon1"></input>
            <Button variant="contained" size="large" onClick={()=>{sendLogInfo()}}>Log</Button>
          </form>
          </div>
        
        <div id="reg_inputs" className="reg_inputs hidden">
          <form>
            <input ref={input_reg_email} type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"></input>
            <br/>

            <input ref={input_reg_password} type="password" className="form-control" placeholder="Password" autoComplete="on" suggested="current-password" aria-label="Password" aria-describedby="basic-addon1"></input>
            <br/>

            <input ref={input_reg_re_password} type="password" className="form-control" placeholder="RePassword" autoComplete="on"suggested="current-password" aria-label="Password" aria-describedby="basic-addon1"></input>
            <Button variant="contained" size="large" onClick={()=>{sendRegInfo()}}>Reg</Button>
          </form>
        </div>
      </div>


    </div>

  </div>;
};

export default LogRegModal;


{/* <Button id="logButton" variant="contained" onClick={()=>{document.getElementById("logButton").setAttribute("variant", "contained");document.getElementById("regButton").setAttribute("variant", "outlined")}}>Log</Button>
        <Button id="regButton" variant="outlined"  onClick={()=>{document.getElementById("regButton").setAttribute("variant", "contained");document.getElementById("logButton").setAttribute("variant", "outlined")}} >Reg</Button> */}