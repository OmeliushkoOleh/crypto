import React from "react";
import './TopBar.css';
import { Link, } from "react-router-dom";
import Button from '@mui/material/Button';
import LogRegModal from "../LogRegModal/LogRegModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import locales from "./I18n";
import { MyContext } from "../../App";
const splitNumber = (number)=>{
  if(!number){
    return
  } else{
  let arr = []
  let splited0
  let splited1
  let count = 0
  
  let splited = number.toString().split(".")
  if(splited.length > 1){
    splited0 = splited[0].split("")
    splited1 = splited[1].split("")
  } else{
    splited0 = splited[0].split("")
  }
  splited0.forEach((e)=>{
    if(count !== 2){
      arr.push(e)
      count = count + 1
    } else{
      count = 0
      arr.push(e)
      arr.push(",")
    }
  })
  if(splited.length > 1){
    if(arr[arr.length - 1] === ","){
      arr.pop()
    }
    arr.push(".")
    arr.push(splited[1])
  } else{
  }
  return arr.join("")
  }
}


const TopBar = () => {

  const navigate = useNavigate();
  const [global, setglobal] = React.useState([])


  const provider = React.useContext(MyContext)

  
  const changeTheme = ()=>{
    let set 
    let remove
    let add 
  if(localStorage.getItem("theme") === "light"){
     set = "dark"
     remove = "light"
     add = "dark"
  } else{
     set = "light"
     remove = "dark"
     add = "light"
  }
  localStorage.setItem("theme",set)
  document.body.classList.remove(remove)
  document.body.classList.add(add)
}

  React.useEffect(()=>{

    if(localStorage.getItem("theme") == null ){
      localStorage.setItem("theme","light")
      document.body.classList.add("light")
    } else{
      document.body.classList.add(localStorage.getItem("theme"))
    }

    axios.get(`https://api.coingecko.com/api/v3/global`)
    .then((response) => {
      setglobal(response.data)
    }, (error) => {
      console.log(error);
    });

  },[])

  const findById = (id)=>{
    localStorage.setItem("currentCoin",id)
    navigate(`/coins/${id}`);
  }

  const search_input_ref = React.useRef("")
  const [listOfFindedCoins, setlistOfFindedCoins] = React.useState([])

  React.useEffect(()=>{
    document.body.addEventListener('click', ()=>{setlistOfFindedCoins([])})
  },[])

const findByName = ()=>{
  if(search_input_ref.current.value === ""){
    return
  }
  setlistOfFindedCoins([])
  document.getElementById("noRes")?.remove()

  axios.get(`https://api.coingecko.com/api/v3/search?query=${search_input_ref.current.value}`)
    .then((response) => {
      if(response.data.coins.length !== 0){
        setlistOfFindedCoins(response.data.coins)
      } else{
        var noRes = document.createElement("div")
        noRes.setAttribute("id","noRes")
        noRes.setAttribute("style","width:220px")
        noRes.innerHTML = "No result"
        document.getElementById("coinSheet").append(noRes)
      }
    }, (error) => {
      console.log(error);
    });
}
const loadChoosenCoinPage = (event)=>{
  search_input_ref.current.value = ""
  setlistOfFindedCoins([])
  axios.get(`https://api.coingecko.com/api/v3/coins/${event.target.id}`)
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
}

let locale = "en";

const showLanguagesSheet = ()=>{
  document.getElementById("languagesSheet")?.classList.toggle("hidden")
}

// const changeLang = (lang)=>{
//   locale = lang 
//   document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
//   document.querySelectorAll("[data-i18-val]").forEach(translateElement);
//   let languageStringifyed = JSON.stringify(lang)
//   localStorage.setItem("Language", languageStringifyed)
// }
// const translateElement = (element)=> {
//   const key  = element.getAttribute("data-i18n-key");
//   const translation = translations[locale][key] ;
//   element.innerText = translation;

//   const val = element.getAttribute("data-i18-val");
//   const translation1 = translations[locale][val];
//   element.value = translation1;
// }



// React.useEffect(()=>{
//   document.getElementById("search_input").addEventListener('input', findByName);
// },[])

const t = provider.translate.bind(null,locales)
  return <div className="top_bar">

    <LogRegModal></LogRegModal>

    <div className="top_bar_item">
      <Button variant="contained"  >
        <Link to=""  className="home" >{t("home")}</Link>
      </Button>
      <div className="global">
      <span><span  >{t("Coins_global")}</span> <span >{new Intl.NumberFormat('ru').format(global?.data?.active_cryptocurrencies)}</span></span>
      <span><span  >{t("Exchanges_global")}</span><span >{global?.data?.markets}</span></span>
      <span><span  >{t("Market_Cap_global")}</span><span >{new Intl.NumberFormat('ru').format(global?.data?.total_market_cap?.usd.toFixed(0)) }</span></span>
      <span><span  >{t("24h_Vol_global")}</span><span >{new Intl.NumberFormat('ru').format(global?.data?.total_volume?.usd?.toFixed(0))}</span></span>
      </div>
    </div> 

    <div className="top_bar_item settings" >
      

      <div className="settings">
      <div className="settings_language" onClick={showLanguagesSheet}>
          <span className="top_item_language_name" >{t("language")}</span>
          <div id="languagesSheet" className="languages hidden">

            <span className="languageSheetItem" onClick={()=>{provider.changeLanguage("en")}}>{t("english")}</span>
            <span className="languageSheetItem" onClick={()=>{provider.changeLanguage("ua")}}>{t("ukraine")}</span>

          </div>  
      </div> 

        <div className="settings_theme" onClick={()=>{changeTheme()}}>
        {localStorage.getItem("theme")  === "light" || localStorage.getItem("theme")  == null ?
        <ion-icon size="large" name="moon-outline" ></ion-icon>:
        <ion-icon size="large" name="sunny-outline"></ion-icon>}
        </div>
      </div>
      
    </div> 

    <div className="top_bar_item search">
        <div style={{display:"flex"}}>
        <input id="search_input" autoComplete="off" className="search_input" placeholder={t("Find")} ref={search_input_ref}></input> 
        <button className="search_button" style={{margin:"5px"}} onClick={()=>{findByName()}} >{t("Find")}</button>
        </div>

     <div style={{display: "flex",flexDirection: "column",alignItems: "center"}}>
      <div id="coinSheet" className="coinSheet">
        {listOfFindedCoins.map((e)=>{
          let key = Math.random()*1000 + Math.random()*1000
          return <div alt="img" key={key} id={e.id} onClick={(event)=>{event.preventDefault();event.stopPropagation();findById(e.id);loadChoosenCoinPage(event)}}> <img style={{width:"20px",height:"20px"}} src={e.thumb}></img> &nbsp;{e.name} ({e.symbol}) </div>
        })}
      </div>
     </div>
    </div> 

    <div className="top_bar_item"> 
      <Button variant="contained" onClick={()=>{document.getElementById("log_reg_modal").classList.toggle("hidden")}} >Log/Reg</Button>

    </div> 

  </div>;
};

export default TopBar;
