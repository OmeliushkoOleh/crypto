
/* global define,Chart*/
import React, { useEffect, useState } from "react";
import './CoinInfo.css';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';



const fix = (num)=>{
  if(num > 0.8){
    return   Intl.NumberFormat('ru').format(num)
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
  labels: [],
  prices : [],
}

const CoinInfo = () => {
  const [currentCoinInfo, setcurrentCoinInfo] = useState({})

  
  useLocation();
  let coinID = document.location.pathname.split("/")[2]
  
  useEffect(()=>{
    axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}`)
    .then((response) => {
      console.log(response);
      setcurrentCoinInfo(response.data)
      document.getElementById("description").innerHTML =  "Click HERE to read more" + "<br/>" + response.data.description.en
      document.getElementById("Full_info_modal_div").innerHTML =  response.data.description.en
    }, (error) => {
      console.log(error);
    });


  // GET MARKET_CHART_1_DAY

  chartRequest(1) 
   

  },[document.location.pathname])

React.useEffect(()=>{
  const interval = setInterval(()=>{
    axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}`)
    .then((response) => {
      document.getElementById("full_price").innerHTML =       fix(response.data.market_data.current_price.usd,) + "$"
      document.getElementById("full_price_low").innerHTML =   fix(response.data.market_data.low_24h.usd) + "$"
      document.getElementById("full_price_high").innerHTML =  fix(response.data.market_data.high_24h.usd) + "$"
    }, (error) => {
      console.log(error);
    });
  },10000)
  return () => {
   clearInterval(interval)
  };
})



const getFivelabels = (arrOflabels)=>{
  let arr = []
  let lengthOfArr = arrOflabels.length
  let period = Math.trunc(lengthOfArr/6)
  arr.push(arrOflabels[0],arrOflabels[period],arrOflabels[period * 2 ],arrOflabels[period * 3],arrOflabels[period * 4],arrOflabels[period * 5],arrOflabels[lengthOfArr - 1])
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
      labels: chartInfo.labels,
      
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

        x: { 
          
            ticks:{
            color:"blue",
            maxTicksLimit: 9,
            minTicksLimit: 5
          },
          
          grid:{
            // color:"transparent"
          },
        },

        y: { 
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
          color:"black",
          font:{
            size:15,
          },
          display: true,
          text: `Press ${modifierKey} + mouse wheel to zoom / ${modifierKey} + mouse click and drug to move chart`
      },
        legend:{
          display:false
        },
        
        title: {
          font:{
            size:20
          },
          color:"black",
          display: true,
          text: `${coinID.toUpperCase()} Chart for ${days} days`
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
    chartInfo.labels = []
    chartInfo.prices = []
    setAlignment("1 DAY")
    axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=${days}`)
    .then((response) => {
      response.data.prices.forEach((e)=>{
        let date = new Date(e[0])
        chartInfo.labels.push( date.getDate() + "." + parseInt(date.getMonth()+1) + "." + date.getFullYear() + "   " + date.getHours() +":" + date.getMinutes() )
        chartInfo.prices.push((e[1]))
      })
      drawChart(days,"linear")
    }, (error) => {
      console.log(error);
    });

  }


const color = (number)=>{
  if(number > 0){
    return <span style={{color:"green"}}> &#129093; {number.toFixed(2)}%</span>
  } else if(number < 0){
    return <span style={{color:"red"}}> &#129095; {Math.abs(number.toFixed(2))}%</span>
  } else{
    return <span>{number}%</span>
  }
}


const [alignment, setAlignment] = React.useState("1 DAY");

const handleChange = (newAlignment) => {
  if(newAlignment == null){
    return
  }
  setAlignment(newAlignment.target.innerText);
};



  return <div className="coinInfo">

    <div className="info">
      <div>
        <span className="full_rank"> Market Cap Rank #&nbsp;{currentCoinInfo?.market_cap_rank }</span>
        <span className="full_name"> <img src={currentCoinInfo?.image?.large}></img> &nbsp;{currentCoinInfo.name} ({currentCoinInfo.symbol?.toUpperCase()})</span>
        <span id="full_price" className="full_price">{fix(currentCoinInfo.market_data?.current_price?.usd)}$</span>


        <span className="progress_container ">
          <progress className="progress " value={((currentCoinInfo.market_data?.current_price?.usd - currentCoinInfo.market_data?.low_24h.usd )/( currentCoinInfo.market_data?.high_24h.usd - currentCoinInfo.market_data?.low_24h.usd) * 100).toFixed(0) } max="100"></progress>

          <div className="min_max">
            <span id="full_price_low">{fix(currentCoinInfo.market_data?.low_24h.usd)}$</span>
            <span>24 hour</span>
            <span id="full_price_high">{fix(currentCoinInfo.market_data?.high_24h.usd)}$</span>
          </div>
          
        </span>
      </div>
      
      
      

      <div className="sec_info">

        <div>
          <div className="sec_info_item">
            <span className="" >Market Cap:&nbsp;{ fix(currentCoinInfo.market_data?.market_cap.usd)}$</span>
            <span className="" >Market Cap change 24h:&nbsp;{color(currentCoinInfo.market_data?.market_cap_change_percentage_24h)}</span>
          </div>

          <div className="sec_info_item">
            <span className="">Circulating Supply:&nbsp;{fix(currentCoinInfo.market_data?.circulating_supply)}</span>
            <span className="">Max Supply:&nbsp;{currentCoinInfo.market_data?.max_supply === null?"∞":fix(currentCoinInfo.market_data?.max_supply)}</span>
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
            <span className="">24 Hour Trading Vol:&nbsp;{fix(currentCoinInfo.market_data?.total_volume.usd)}$</span>
            <span className="">All time High Price:&nbsp;{fix(currentCoinInfo.market_data?.ath.usd)}$</span>

          </div>
          <div className="sec_info_item description" onClick={()=>{document.getElementById("Full_info_modal").classList.remove("hidden")}}>
            <span id="description" className="description"></span>
          </div>
        </div>

      </div>

    </div>
    <div id="market_chart_container" className="market_chart_container">
    <ToggleButtonGroup color="primary"
          value={alignment}
          exclusive
          onChange={(e)=>{handleChange(e)}}
          aria-label="Platform"
        >
      <ToggleButton value={"1 DAY"} onClick={(e)=>{chartRequest(1)}}>1 DAY</ToggleButton>
      <ToggleButton value={"7 DAYS"}  onClick={(e)=>{chartRequest(7)}}>7 DAYS</ToggleButton>
      <ToggleButton value={"30 DAYS"} onClick={(e)=>{chartRequest(30)}}>30 DAYS</ToggleButton>
      <ToggleButton value={"180 DAYS"} onClick={(e)=>{chartRequest(180)}}>180 DAYS</ToggleButton>
      <ToggleButton value={"1 YEAR"} onClick={(e)=>{chartRequest(365)}}>1 YEAR</ToggleButton>
      <ToggleButton value={"MAX"} onClick={(e)=>{chartRequest("max")}}>MAX</ToggleButton>
    </ToggleButtonGroup>
    

    <button className="chart_button" onClick={()=>{changeChartToLog()}}>Log</button>
    <canvas id="chart"   ></canvas>

    </div>
    
  </div>;
};

export default CoinInfo;
