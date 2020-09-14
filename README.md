## Color Cluster
This tool extracts the dominant colors of your image gallery and then sorts the images  
using machine-learning techniques. The idea originated as a tool that could learn to  
arrange your photos into a pleasing format for Instagram.   
  
App hosted at [https://color-cluster.netlify.app/](https://color-cluster.netlify.app)

The app currently limits the number of images you can upload to 30 images per analysis.

## Demonstration
![](public/demo.gif)

## External Resources Used
API: [clarifai API](https://www.clarifai.com)   
ML Models: [skmeans](https://www.npmjs.com/package/skmeans), [ml-js/pca](https://github.com/mljs/pca)  
Graphs: [plotly.js](https://github.com/plotly/plotly.js/)  
Color Space Conversion: [tinycolor2](https://www.npmjs.com/package/tinycolor2)  
Image Upload: [react-dropzone-uploader](https://www.npmjs.com/package/react-dropzone-uploader)  
Image Compression: [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)  
UI: [reactjs-popup](https://www.npmjs.com/package/reactjs-popup), [react-fade-in](https://www.npmjs.com/package/react-fade-in), [react-tooltip](https://www.npmjs.com/package/react-tooltip)
