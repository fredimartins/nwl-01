import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi'
import './styles.css';

interface Params {
  onFileUpload: (file: File) => void
}

const Dropzone: React.FC<Params> = (props) => {
  const [selectedFileURL, setSelectedFileURL] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileURL(fileUrl);
    props.onFileUpload(file);
  }, [props.onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'

  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      {
        selectedFileURL ? <img src={selectedFileURL}></img> : <p><FiUpload />Imagem do estabelecimento</p>
      }

    </div>
  )
}

export default Dropzone;