import React, { useEffect } from 'react';
import '../App.css';
import './Header.css';

const Header = () => {

   useEffect(() => {
      document.title = "Image-Color-Analyzer"
   })

   return (
      <header>
         <h1>Image-Color-Analyzer</h1>
      </header>
   );
}

export default Header