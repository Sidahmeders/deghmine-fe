import { Avatar, Input } from '@chakra-ui/react'
import { useRef } from 'react'

const UploaderAvatar = ({ onLoad, src }) => {
  const inputFileRef = useRef(null)

  const handleImageUpload = () => {
    inputFileRef.current.click()
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = () => onLoad(reader)

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Avatar size="xl" cursor="pointer" src={src} onClick={handleImageUpload} />
      <Input type="file" ref={inputFileRef} display="none" onChange={handleImageChange} />
    </>
  )
}

export default UploaderAvatar
