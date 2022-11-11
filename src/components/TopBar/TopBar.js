import React from "react";
import './TopBar.css';
import { Link, } from "react-router-dom";
import Button from '@mui/material/Button';
import LogRegModal from "../LogRegModal/LogRegModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
    if(arr[arr.length - 1] == ","){
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

  React.useEffect(()=>{
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

console.log();
  return <div className="top_bar">

    <LogRegModal></LogRegModal>

    <div className="top_bar_item">
      <Button variant="contained" >
        <Link to="" data-i18n-key="home" className="home" >Home</Link>
      </Button>
      <div className="global">
        <span>Coins:&nbsp;{new Intl.NumberFormat('ru-RU').format(global?.data?.active_cryptocurrencies)}</span>
        <span>Exchanges:&nbsp;{global?.data?.markets}</span>
        <span>Market Cap:&nbsp;{new Intl.NumberFormat('ru-RU').format(global?.data?.total_market_cap?.usd.toFixed(0)) }</span>
        <span>24h Vol: &nbsp;{new Intl.NumberFormat('ru-RU').format(global?.data?.total_volume?.usd?.toFixed(0))}</span>
      </div>
    </div> 

    <div className="top_bar_item">
      
      <div className="settings">
        <div className="settings_language">
          
        </div>
        <div className="settings_theme">
          
        </div>
      </div>
    </div> 

    <div className="top_bar_item search">
    {/* <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Crypto" aria-label="Recipient's username" aria-describedby="button-addon2"></input>
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Find</button>
    </div> */}
     <div style={{display:"flex"}}>
      <input className="search_input" ref={search_input_ref}></input> 
      <button className="search_button" style={{margin:"5px"}} onClick={()=>{findByName()}}>Find</button>
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
