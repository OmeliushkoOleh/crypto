import React from "react";
import TopBar from './components/TopBar';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Main from './components/Main';
import CoinInfo from "./components/CoinInfo/CoinInfo";
import LeftBar from "./components/LeftBar";
import FullInfoModal from "../src/components/FullInfoModal/FullInfoModal";
import { t } from "i18next";

export const MyContext = React.createContext([]);

function App() {


const [language,setLanguage] = React.useState(localStorage.getItem("Language")||"en")

const changeLanguage = (lang)=>{
    setLanguage(lang)
    localStorage.setItem("Language",lang)
}
const translate =    (locales,fieldName)=>{
    if(!locales[language][fieldName]){
      console.log(fieldName);
    } else{
      return locales[language][fieldName]

    }
}



  return (
    <div className="App">
      <FullInfoModal ></FullInfoModal>

      <MyContext.Provider value={{setLanguage,changeLanguage,translate}}>
        <TopBar></TopBar>
        {/* <LeftBar></LeftBar> */}
        <Routes>
          <Route path="/"   element={<Main></Main>} />

          <Route path="/coins/:coin"   element={<CoinInfo></CoinInfo>} />
          
      </Routes>

    </MyContext.Provider>
    </div>
  );
}

export default App;
