import React from 'react'
import Dropzone from 'react-dropzone-uploader'
import imageCompression     from 'browser-image-compression';
import 'react-dropzone-uploader/dist/styles.css'
import '../App.css'
import './Dropzone.css'

const MyDropzone = (props) => {

  const getPrimaryColor = (clarifaiOutput) => {
    const sortedColors = clarifaiOutput[0].data.colors.sort((a, b) => { 
      return b.value - a.value });
    return sortedColors[0].raw_hex;
  }

  const compressImage = async (file, maxWidthOrHeight) => {
    const output = await imageCompression(file, { maxWidthOrHeight });
    return output
  }

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {

    // set num of expected images to existing images + new files
    let expectedImages = props.expectedImages + allFiles.length
    props.setExpectedImages(expectedImages);

    allFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        
        try {

          const dataUrl = reader.result;
          const base64str = dataUrl.split(',')[1];

          const submitImage = async () => {
            if (props.state.images.length >= 30) {
              return null 
            }
            const clarifaiOutput = await props.runClarifaiModel(base64str);
            const primaryColor = await getPrimaryColor(clarifaiOutput)
            await props.pushImageToState(
              props.state.images.length + idx + 1, // id
              dataUrl, // url //
              primaryColor, // primaryColor
              1, // index //default
            )
          }

          submitImage();

        } catch(e) {

          console.log(e);
          expectedImages -= 1;
          props.setExpectedImages(expectedImages)
          return null

        }

      }
      // Compress image before loading it into state
      compressImage(file.file)
      .then(output => reader.readAsDataURL(output));
      file.remove()
    })
    props.onRouteChange();
  }

  return (
    <React.Fragment>
      <div className='title-container'>
        <h1>Upload Images</h1>
      </div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="image/*"
        inputContent={(files, extra) => (
          extra.reject ? 'Images Only' : 'Drop Images Here or Click to Browse'
        )}
        maxFiles={30}
        minSize={0}
        maxSize={1048576}
        styles={{
          inputLabel: {
            color: '#c94b4b'
          }
        }}
      />
    </React.Fragment>
  )
}

export default MyDropzone