import React from "react";
import TopBar from './components/TopBar';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Main from './components/Main';
import CoinInfo from "./components/CoinInfo/CoinInfo";


export const MyContext = React.createContext([]);

function App() {







  return (
    <div className="App">
      <MyContext.Provider value={{}}>
        <TopBar></TopBar>
        
        <Routes>

          <Route path="/"   element={<Main></Main>} />

          <Route path="/coins/:coin"   element={<CoinInfo></CoinInfo>} />
          <Route path="/game_2"   element={<div></div>} />
          
      </Routes>

    </MyContext.Provider>
    </div>
  );
}

export default App;
