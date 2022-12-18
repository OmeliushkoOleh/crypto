import React, { useRef } from "react";
import './LogRegModal.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import locales from "./I18n";
import {MyContext} from "../../App"
import  $ from "jquery"




const LogRegModal = () => {

  const input_log_email = React.useRef("")
  const input_log_password = React.useRef("")

  const input_reg_email = React.useRef("")
  const input_reg_password = React.useRef("")
  const input_reg_re_password = React.useRef("")


 


  const handlechoose = (button)=>{
    if(button == "log"){
      document.getElementById("log_inputs").classList.remove("hidden");
      document.getElementById("reg_inputs").classList.add("hidden");

    } else{
      document.getElementById("reg_inputs").classList.remove("hidden");
      document.getElementById("log_inputs").classList.add("hidden");

    }
  }

  const sendLogInfo = ()=>{
    let data = {}
    data.email = input_log_email.current.value
    data.password = input_log_password.current.value
    $.ajax({
      type: "post",
      data: data,
      url: "http://localhost:4000/login_user",
      success: (res)=>{
        console.log(res);  
        console.log(res.favorites);  
        document.getElementById("log_reg_modal").classList.toggle("hidden")
        localStorage.setItem("favorites",res.favorites)
        localStorage.setItem("currentUser",res.email)
      },
      error: function(res) {
        alert(res.responseText)
      }
    })
    input_log_email.current.value = ""
    input_log_password.current.value = ""
  }
  
  const sendRegInfo = ()=>{
    let data = {}
    data.email = input_reg_email.current.value
    data.password = input_reg_password.current.value
    data.rePassword = input_reg_re_password.current.value

    $.ajax({
      type: "post",
      data: data,
      url: "http://localhost:4000/registrate_user",
      success: (res)=>{
        console.log(res);
        document.getElementById("log_reg_modal").classList.toggle("hidden")
        localStorage.setItem("favorites",res.favorites)
        localStorage.setItem("currentUser",res.email)  
      },
      error: function(res) {
        alert(res.responseText)
      }
    })
    input_reg_email.current.value = ""
    input_reg_password.current.value = ""
    input_reg_re_password.current.value = ""
  }
  const provider = React.useContext(MyContext)

  const t = provider.translate.bind(null,locales)

  const [alignment, setAlignment] = React.useState("logButton");

  const handleChange = (newAlignment) => {
    if(newAlignment == null){
      return
    }
    setAlignment(newAlignment.target.id);
  };

  return <div id="log_reg_modal" className="log_reg_modal hidden" onClick={()=>{document.getElementById("log_reg_modal").classList.toggle("hidden")}}>
    
    <div className="log_reg_container" onClick={(e)=>{e.preventDefault();e.stopPropagation();}} >

      <div className="log_reg_choose">
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={(e)=>{handleChange(e)}}
          aria-label="Platform"
        >
          <ToggleButton id="logButton" value={"logButton"} onClick={()=>{handlechoose("log")}}>{t("authorization")}</ToggleButton>
          <ToggleButton id="regButton" value={"regButton"} onClick={()=>{handlechoose("reg") }}>{t("registration")}</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="inputs">
        <div id="log_inputs" className="log_inputs">
          <form>
            <input ref={input_log_email} type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"></input>
            <br/>
            
            <input ref={input_log_password} type="password" className="form-control" placeholder={t("password")} autoComplete="on"suggested="current-password"aria-label="Password" aria-describedby="basic-addon1"></input>
            <Button variant="contained" size="large" onClick={()=>{sendLogInfo()}}>{t("login")}</Button>
          </form>
          </div>
        
        <div id="reg_inputs" className="reg_inputs hidden">
          <form>
            <input ref={input_reg_email} type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"></input>
            <br/>

            <input ref={input_reg_password} type="password" className="form-control" placeholder={t("password")} autoComplete="on" suggested="current-password" aria-label="Password" aria-describedby="basic-addon1"></input>
            <br/>

            <input ref={input_reg_re_password} type="password" className="form-control" placeholder={t("RePassword")} autoComplete="on"suggested="current-password" aria-label="Password" aria-describedby="basic-addon1"></input>
            <Button variant="contained" size="large" onClick={()=>{sendRegInfo()}}>{t("signup")}</Button>
          </form>
        </div>
      </div>


    </div>

  </div>;
};

export default LogRegModal;


{/* <Button id="logButton" variant="contained" onClick={()=>{document.getElementById("logButton").setAttribute("variant", "contained");document.getElementById("regButton").setAttribute("variant", "outlined")}}>Log</Button>
        <Button id="regButton" variant="outlined"  onClick={()=>{document.getElementById("regButton").setAttribute("variant", "contained");document.getElementById("logButton").setAttribute("variant", "outlined")}} >Reg</Button> */}