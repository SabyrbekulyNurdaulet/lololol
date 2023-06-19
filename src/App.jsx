import './App.css'

import React, { useState } from 'react'

import Company_logo from './modules/images/logo.png'
import Instagram from './modules/images/Instagram.png'
import Facebook from './modules/images/Facebook.png'
import Vk from './modules/images/Vk.png'

import MainPanel from './modules/MainPanel/MainPanel.jsx'
import AdminPanel from './modules/AdminPanel/AdminPanel.jsx'

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'))

  const handleSetIsAuth = (token) => {
    setIsAuth(token)
  }

  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src={Company_logo}/>

        <div className='header-part'>
          <div className='header-top'>
            <nav className='slogon'>Самый лучший магазин с гитарами в Казахстане!</nav>
            <div className='actions'>
              <AdminPanel element={isAuth} handleSetIsAuth={handleSetIsAuth}/>
            </div>
          </div>
        </div>
      </header>

      <MainPanel />

      <div className='bottom'>
        <div className='info'>
          <nav>Г. Алматы ул. Байтурсынова 22</nav>
          <div className='time'>
            <nav>пн-пт 10:00 — 21:00</nav>
            <nav>сб-вс 11:00 — 20:00 </nav>
          </div>
          <nav>+7 775 120 90 89</nav>
          <div className='links'>
            <a href='https://www.instagram.com/'><img className='inst' src={Instagram} /></a>
            <a href='https://ru-ru.facebook.com/'><img src={Facebook} /></a>
            <a href='https://vk.com/'><img src={Vk} /></a>
          </div>
          <nav>@Все права защищены</nav>
        </div>
      </div>
    </div>
  );
}

export default App;
