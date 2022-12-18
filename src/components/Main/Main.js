import React, { useState } from "react";
import './Main.css';
import {MyContext} from "../../App"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import  $ from "jquery"
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
let arrOfAllCrypt
const Main = () => {

  const provider = React.useContext(MyContext)
  
  const navigate = useNavigate();

  const [favoritesArr, setFavoritesArr] = useState([])
  const [arrOfCrypt, setArrOfCrypt] = useState([])
  const [sorted, setsorted] = useState(false)
  const [page, setPage] = React.useState(1);
  const [isFavoritesShowed, setIsFavoritesShowed] = React.useState(false);

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
    setArrOfCrypt(arrOfCrypt)
    
  },[localStorage.getItem("currentUser")])

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
      setArrOfCrypt(response.data)
      arrOfAllCrypt = response.data
    }, (error) => {
      console.log(error);
    });
    if(localStorage.getItem("favorites")){
      setFavoritesArr(localStorage.getItem("favorites").split(","))
    } else{
      setFavoritesArr([])
    }
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
    setArrOfCrypt([...newArr])
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
      setArrOfCrypt(response.data)
    }, (error) => {
      console.log(error);
    });
  }

  const t = provider.translate.bind(null,locales)

   const favorites = (e)=>{
    if(localStorage.getItem("currentUser") === "null"){
      return
    }
    let arr = favoritesArr
    if(favoritesArr.includes(e.target.id)){
      arr = arr.filter(e1=>e1 !== e.target.id)
      setFavoritesArr(arr)
      e.target.classList.toggle("in_favotite")
      localStorage.setItem("favorites",arr)
    } else{
      arr.push(e.target.id)
      setFavoritesArr(arr)
      e.target.classList.toggle("in_favotite")
      localStorage.setItem("favorites",arr)
    }
    let data = {}
    data.favorites = arr
    data.email = localStorage.getItem("currentUser")
    $.ajax({
      type: "post",
      data: data,
      url: "http://localhost:4000/favorites_change",
      success: (res)=>{
      },
      error: function(res) {
        alert(res.responseText)
      }
    })
   }
   
   const showHideOnlyFavorites = (e)=>{

    e.target.classList.toggle("in_favotite")
    if(isFavoritesShowed === false){
      let favorites = localStorage.getItem("favorites");
      let arr = [];
      arrOfCrypt.forEach((e)=>{
        if(favorites.includes(e.id)){
          arr.push(e)
        }
      })
      setArrOfCrypt(arr)
      console.log(arr);
      setIsFavoritesShowed(true)
    } else{
      setArrOfCrypt(arrOfAllCrypt)
      console.log(arrOfAllCrypt);
      setIsFavoritesShowed(false)
    }

   }  

  return <div className="main">
      <div className="navigation top" onClick={()=>{window.scrollTo(0,0)}}>&#129153;</div>
      <div className="navigation bot" onClick={()=>{window.scrollTo(0,20000)}}>&#129155;</div>
    <div className="table-container">
      <table>

        <thead>
          <tr>
            <td  onClick={(e)=>{showHideOnlyFavorites(e)}}><span className="favorite">&#9733;</span></td>
            <td  className="tir_td" onClick={()=>{sortBy(arrOfCrypt,"market_cap_rank")}}>#</td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"name")}} className="name" > {t("name")}</td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"current_price")}}>{t("Price")}</td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"market_cap")}}>{t("MarketCap")}</td>
            <td  onClick={()=>{sortBy(arrOfCrypt,"total_volume")}}>{t("Volume")}</td>
            <td  className="price_change_td" onClick={()=>{sortBy(arrOfCrypt,"price_change_percentage_24h")}}>{t("price_change")}</td>
          </tr>
        </thead>
        

        <tbody>
          {arrOfCrypt.map((e)=>{
            let key = Math.random()*100 + Math.random()*100
            return (
            <tr  key={key}>
              <td ><span className="favorite" onClick={(e)=>{favorites(e)}} >{favoritesArr.length !==0 && favoritesArr.includes(e.id)?
                <span id={e.id} className="in_favotite">&#9733;</span>:
                <span id={e.id} >&#9734;</span>}
              </span></td>
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
