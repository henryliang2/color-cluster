import React from 'react'
import Dropzone from 'react-dropzone-uploader'
import imageCompression     from 'browser-image-compression';
import 'react-dropzone-uploader/dist/styles.css'
import './Dropzone.css'

const MyDropzone = (props) => {

  const compressImage = async (file, maxWidthOrHeight) => {
    const output = await imageCompression(file, { maxWidthOrHeight });
    return output
  }

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(file => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        let base64Str = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
        const submitImage = async () => {
          const clarifaiOutput = await props.runClarifaiModel(base64Str);
          const primaryColor = await props.getPrimaryColor(clarifaiOutput)
          const currentState = await props.getState();
          await props.pushImageToState(
            currentState.images.length + 1,
            `data:image/png;base64, ${base64Str}`, // need to correct to accept all image types
            primaryColor,
            1, // default
          )
        }
        submitImage();
      }
      // Compress image before loading it into state
      compressImage(file.file, 500)
      .then(output => { reader.readAsArrayBuffer(output);});
      file.remove()
    })
    props.onRouteChange();
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*"
    />
  )
}

export default MyDropzone