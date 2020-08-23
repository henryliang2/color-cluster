import React from 'react';
import './Footer.css'

const Footer = () => {
  
  const array = [
    ['https://www.clarifai.com/', 'clarifai API'],
    ['https://www.npmjs.com/package/skmeans', 'skmeans'],
    ['https://github.com/mljs/pca', 'ml-js/pca'],
    ['https://github.com/plotly/plotly.js/', 'plotly.js'],
    ['https://www.npmjs.com/package/reactjs-popup', 'reactjs-popup'],
    ['https://www.npmjs.com/package/react-fade-in', 'react-fade-in'],
    ['https://www.npmjs.com/package/react-tooltip', 'react-tooltip'],
    ['https://www.npmjs.com/package/tinycolor2', 'tinycolor2'],
    ['https://www.npmjs.com/package/react-dropzone-uploader', 'react-dropzone-uploader'],
    ['https://www.npmjs.com/package/browser-image-compression', 'browser-image-compression'],
  ]

  return (
    <footer>
      <p className='footer-title'>Packages Used</p>
      {
        array.map((link, i) => {
          return <p key={i}>
            <a href={link[0]}>
              {link[1]}
            </a>
          </p>
        })
      }
    </footer>
  );
}

export default Footer;