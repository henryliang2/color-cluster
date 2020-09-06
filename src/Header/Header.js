import React from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import '../App.css';
import './Header.css';

const Header = (props) => {

   return (
      <header>
         <h1 className='header-link' 
            onClick={() => {props.resetState()}}
            >
            ColorCluster
         </h1>
         <h1>
            <a className='header-link' href='https://github.com/henryliang2'>
               <FaGithub className='icons'/>
            </a>
            <a className='header-link' href='https://instagram.com/zomgitshenry'>
               <FaInstagram className='icons'/>
            </a>
         </h1>
      </header>
   );
}

export default Header