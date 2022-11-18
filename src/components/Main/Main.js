import React, { useState } from "react";
import './Main.css';
import {MyContext} from "../../App"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';

import locales from "./I18n";

export   function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
export   const fix = (num)=>{
  if(num > 0.000001){
    return  num 
  } else{
    let sec = num + 1
    let str = sec.toString()
    let arr =   str.split("").slice(1).reverse()
    arr.push("0")
    return arr.reverse().join("")
  }
}

const Main = () => {

  const provider = React.useContext(MyContext)
  
  const navigate = useNavigate();

  const [arrOfCrypt, setarrOfCrypt] = useState([])
  const [sorted, setsorted] = useState(false)
  const [page, setPage] = React.useState(1);

  let context = React.useContext(MyContext)

  const color = (number)=>{
    if(number > 0){
      return <span style={{color:"green"}}> &#129093; {number.toFixed(2)}%</span>
    } else if(number < 0){
      return <span style={{color:"red"}}> &#129095; {Math.abs(number.toFixed(2))}%</span>
    } else{
      return <span>{number}%</span>
    }
  }


  React.useEffect(()=>{
    let page = localStorage.getItem("currentPage")
    setPage(parseInt(page))
    // axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=false')
    // .then((response) => {
    //   console.log(response.data.length);
    //   let totalPages = ( response.data.length / 100 ).toFixed(0)
    //   console.log(totalPages);
    // }, (error) => {
    //   console.log(error);
    // });
    // // 133 pages total
   
    if(page === null ){
      page = 1
      localStorage.setItem("currentPage",1)
    }

    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`)
    .then((response) => {
      console.log(response);
      response.data.forEach((e)=>{
        e.img = new Image(25, 25)
        e.img.src = e.image
      })
      setarrOfCrypt(response.data)
    }, (error) => {
      console.log(error);
    });
    
    
},[])




  const sortBy = (arr,sortParam)=>{
    let newArr = []
    let coef = sorted? -1: 1;
    newArr = arr.sort((a,b)=>{
      if(a[sortParam] < b[sortParam]) { return -coef; }
      if(a[sortParam] > b[sortParam]) { return coef; }
      return 0;
    })
    setsorted(!sorted)
    setarrOfCrypt([...newArr])
  }

  const findById = (id)=>{
    localStorage.setItem("currentCoin",id)
    window.scrollTo(0, 0)
    navigate(`/coins/${id}`);
  }



  const changePage = (value)=>{
    window.scrollTo(0, 0)
    setPage(value);
    console.log(value)
    localStorage.setItem("currentPage",value)
    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${value}&sparkline=false`)
    .then((response) => {
      console.log(response)
      response.data.forEach((e)=>{
        
        e.img = new Image(25, 25)
        e.img.src = e.image
      })
      setarrOfCrypt(response.data)
    }, (error) => {
      console.log(error);
    });
  }

  const t = provider.translate.bind(null,locales)

  return <div className="main">
      <div className="navigation top" onClick={()=>{window.scrollTo(0,0)}}>&#129153;</div>
      <div className="navigation bot" onClick={()=>{window.scrollTo(0,20000)}}>&#129155;</div>
    <div className="table-container">
      <table>

        <thead>
          <tr>
            <td  onClick={()=>{sortBy(arrOfCrypt,"market_cap_rank")}}><span className="header_td">#
            <span className="tooltiptext">Tooltip text</span></span></td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"name")}} className="name" > {t("name")}<span className="header_td"></span></td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"current_price")}}>{t("Price")}<span className="header_td"></span></td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"market_cap")}}>{t("MarketCap")}<span className="header_td"></span></td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"total_volume")}}>{t("Volume")}<span className="header_td"></span></td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"price_change_percentage_24h")}}>{t("price_change")}<span className="header_td"></span></td>
          </tr>
        </thead>
        

        <tbody>
          {arrOfCrypt.map((e)=>{
            let key = Math.random()*100 + Math.random()*100
            return (
            <tr  key={key}>
              <td>{e.market_cap_rank} </td>
              <td className="name" onClick={()=>{findById(e.id)}} > <img style={{width:"25px",height:"25px"}} src={e.image}></img> &nbsp; {e.name} <span style={{color:"grey",fontWeight:"500"}}>({e.symbol.toUpperCase()})</span></td>
              <td >{fix(e.current_price)}$</td>
              <td >{Intl.NumberFormat('ru').format(e.market_cap)}$</td>
              <td >{Intl.NumberFormat('ru').format(e.total_volume)}$</td>
              <td >{color(e.price_change_percentage_24h)}</td>
            </tr>
            )
          }
          )}
        </tbody>
      </table>
      

      <div className="pagination_container">

      <Pagination id="pagination"  defaultPage={parseInt(localStorage.getItem("currentPage"))}  page={page} style={{margin:"20px"}} boundaryCount={2}  onChange={(e,value)=>{changePage(value)}} count={133} color="primary" />

      </div>
    </div>
    
  </div>;
};

export default Main;
