import React from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import '../App.css';
import './Header.css';

const Header = () => {

   document.title = "ColorCluster";

   return (
      <header>
      <h1>ColorCluster</h1>
      <h1>
         <a href='https://github.com/henryliang2'><FaGithub className='icons'/></a>
         <a href='https://instagram.com/zomgitshenry'><FaInstagram className='icons'/></a>
      </h1>
      </header>
   );
}

export default Header