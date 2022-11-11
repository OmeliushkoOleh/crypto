
/* global define,Chart*/
import React, { useEffect, useState } from "react";
import './CoinInfo.css';
import axios from "axios";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useLocation } from 'react-router-dom';


const fix = (num,fixNum)=>{
  if(num > fixNum){
    return  num.toFixed(2) 
  } else{
    let sec = num + 1
    let str = sec.toString()
    let arr =   str.split("").slice(1).reverse()
    arr.push("0")
    return arr.reverse().join("")
  }
}

export const splitNumber = (number)=>{

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

let MyChart = null;

let chartInfo = {
  lables: [],
  minlables:[],
  prices : [],
  name:"",
  date:""
}

const CoinInfo = () => {
  const [currentCoinInfo, setcurrentCoinInfo] = useState({})

  
  useLocation();
  let coinID = document.location.pathname.split("/")[2]





const getFiveLables = (arrOfLables)=>{
  let arr = []
  let lengthOfArr = arrOfLables.length
  let period = Math.trunc(lengthOfArr/6)
  arr.push(arrOfLables[0],arrOfLables[period],arrOfLables[period * 2 ],arrOfLables[period * 3],arrOfLables[period * 4],arrOfLables[period * 5],arrOfLables[lengthOfArr - 1])
  return arr
}

const [chartTypeNow, setchartTypeNow] = React.useState("linear")
const [days1, setdays1] = React.useState(1)

const changeChartToLog = ()=>{
if(chartTypeNow == "linear"){
  drawChart(days1,"logarithmic")
  setchartTypeNow("logarithmic")
} else{
  drawChart(days1,"linear")
  setchartTypeNow("linear")
}


  
}
const drawChart = (days,type)=>{
  if(MyChart ){
    MyChart.destroy();
  }
  setdays1(days)
  let modifierKey = "alt"
  MyChart = new Chart(document.getElementById("chart").getContext('2d'), {
    type: 'line',

    data: {
      labels: chartInfo.minlables,
      // labels: getFiveLables(chartInfo.minlables) ,
      datasets: [{ 
        data: chartInfo.prices,
        label: coinID +" " + "price",
        borderColor: chartInfo.prices[0] < chartInfo.prices.slice(-1)?"green":"red",
        fill: false,
        tension: 0.1,
      }]
    },
    
    options: {
      
      scales: {

        xAxisID: { 
          
            ticks:{
            color:"blue",
            maxTicksLimit: 9,
            minTicksLimit: 5
          },
          
          grid:{
            // color:"transparent"
          },
        },

        yAxisID: { 
          type: type ==='logarithmic'?'logarithmic':"linear",
          ticks:{
            color:"blue",
          },
          grid:{
            // color:"transparent"
          }
        },
        
      },
      elements: {
        point: {
          radius:0.2,
          backgroundColor:chartInfo.prices[0] < chartInfo.prices.slice(-1)?"green":"red",
          pointStyle:"circle",
          hitRadius:5,
        },
      },
      
      plugins: {
        subtitle: {
          display: true,
          text: `Press ${modifierKey} + mouse wheel to zoom / ${modifierKey} + mouse click and drug to move chart`
      },
        legend:{
          display:false
        },
        
        title: {
          display: true,
          text: `Chart for ${coinID.toUpperCase()} for ${days} days`
        },

        zoom: {
          limits: {
            // x: {min: -2, max: 2, minRange: 50},
            y: {min: Math.min(...chartInfo.prices) - (Math.min(...chartInfo.prices) * 0.01), max: Math.max(...chartInfo.prices) + (Math.max(...chartInfo.prices) * 0.01), minRange: 50}
          },
          pan: {
            enabled:true,
            mode:"x",
            modifierKey:modifierKey
          },
          zoom: {
            wheel: {
              modifierKey:modifierKey,
              enabled: true,
            },
            drag:{
              enabled: false,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
            
          }
        }
      }
    }
  });
}


  const chartRequest = (days)=>{
    chartInfo.lables = []
    chartInfo.minlables = []
    chartInfo.prices = []

    axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=${days}`)
    .then((response) => {
      response.data.prices.forEach((e)=>{
        let date = new Date(e[0])
        chartInfo.lables.push( date.getDate() + "." + parseInt(date.getMonth()+1) + "." + date.getFullYear() + "   " + date.getHours() +":" + date.getMinutes() )
        chartInfo.minlables.push(date.getDate() + "." + parseInt(date.getMonth()+1) + "." + date.getFullYear() + "   " + date.getHours() +":" + date.getMinutes() )
        chartInfo.prices.push(fix(e[1],0.8))
      })
      
      drawChart(days,"linear")
    }, (error) => {
      console.log(error);
    });

  }

  

  useEffect(()=>{

    axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}`)
    .then((response) => {
      console.log(response);
      setcurrentCoinInfo(response.data)
      document.getElementById("description").innerHTML =  response.data.description.en
    }, (error) => {
      console.log(error);
    });


  // GET MARKET_CHART_1_DAY

  chartRequest(1) 
   

  },[document.location.pathname])



const color = (number)=>{
  if(number > 0){
    return <span style={{color:"green"}}> &#129093; {number.toFixed(2)}%</span>
  } else if(number < 0){
    return <span style={{color:"red"}}> &#129095; {Math.abs(number.toFixed(2))}%</span>
  } else{
    return <span>{number}%</span>
  }
}











  return <div className="coinInfo">
    <div className="info">

      <div>
        <span className="full_rank"> Market Cap Rank #&nbsp;{currentCoinInfo?.market_cap_rank }</span>
        <span className="full_name"> <img src={currentCoinInfo?.image?.large}></img> &nbsp;{currentCoinInfo.name} ({currentCoinInfo.symbol?.toUpperCase()})</span>
        <span className="full_price">{fix(currentCoinInfo.market_data?.current_price?.usd,2)} &nbsp;$</span>


        <span className="progress_container ">
          <progress className="progress " value={((currentCoinInfo.market_data?.current_price?.usd - currentCoinInfo.market_data?.low_24h.usd )/( currentCoinInfo.market_data?.high_24h.usd - currentCoinInfo.market_data?.low_24h.usd) * 100).toFixed(0) } max="100"></progress>
          <div className="min_max">
            <span>{fix(currentCoinInfo.market_data?.low_24h.usd,2)}$</span>
            <span>24 hour</span>
            <span>{fix(currentCoinInfo.market_data?.high_24h.usd,2)}$</span>
          </div>
        </span>
      </div>
      
      
      

      <div className="sec_info">

        <div>
          <div className="sec_info_item">
            <span className="">Market Cap:&nbsp;{ Intl.NumberFormat('ru-RU').format(currentCoinInfo.market_data?.market_cap.usd)}$</span>
            <span className="">Market Cap change 24h:&nbsp;{color(currentCoinInfo.market_data?.market_cap_change_percentage_24h)}</span>
          </div>

          <div className="sec_info_item">
            <span className="">Circulating Supply:&nbsp;{Intl.NumberFormat('ru-RU').format(currentCoinInfo.market_data?.circulating_supply)}</span>
            <span className="">Max Supply:&nbsp;{Intl.NumberFormat('ru-RU').format(currentCoinInfo.market_data?.max_supply)}</span>
          </div>
        </div>

        <div>
          <div className="sec_info_item">
            <span>Price Change</span>
            <span className="">24h:&nbsp;{color(currentCoinInfo.market_data?.price_change_percentage_24h)}</span>
            <span className="">7d:&nbsp;{color(currentCoinInfo.market_data?.price_change_percentage_7d)}</span>
            <span className="">30d:&nbsp;{color(currentCoinInfo.market_data?.price_change_percentage_30d)}</span>
            <span className="">1y:&nbsp;{color(currentCoinInfo.market_data?.price_change_percentage_1y)}</span>
          </div>

          <div className="sec_info_item">
            <span className="">24 Hour Trading Vol:&nbsp;{Intl.NumberFormat('ru-RU').format(currentCoinInfo.market_data?.total_volume.usd)}$</span>
            <span className="">All time High Price:&nbsp;{Intl.NumberFormat('ru-RU').format(currentCoinInfo.market_data?.ath.usd)}$</span>

          </div>
          <div className="sec_info_item description" >
            <span id="description" className="description"></span>
          </div>
        </div>

      </div>

    </div>
    <div id="market_chart_container" className="market_chart_container">
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={()=>{chartRequest(1)}}>1 DAY</Button>
      <Button onClick={()=>{chartRequest(7)}}>7 DAYS</Button>
      <Button onClick={()=>{chartRequest(30)}}>30 DAYS</Button>
      <Button onClick={()=>{chartRequest(180)}}>180 DAYS</Button>
      <Button onClick={()=>{chartRequest(365)}}>1 YEAR</Button>
      <Button onClick={()=>{chartRequest("max")}}>MAX</Button>
      
    </ButtonGroup>
    <button onClick={()=>{changeChartToLog()}}>Log</button>
    <canvas id="chart"   ></canvas>

    </div>
    
  </div>;
};

export default CoinInfo;
