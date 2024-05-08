const UPLOAD_URL = 'https://api.cloudinary.com/v1_1/devcvus7v/image/upload'
const ACCEPTED_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg']

const uploadImage = async (files) => {
  if (!ACCEPTED_FILE_FORMATS.includes(files[0].type)) {
    throw new Error(`file/type must one of ${JSON.stringify(ACCEPTED_FILE_FORMATS)} but we found ${files[0].type}`)
  }

  const formData = new FormData()
  formData.append('file', files[0])
  // Upload preset in Cloudinary
  formData.append('upload_preset', 'chat-app')
  // Cloud name in Cloudinary
  formData.append('cloud_name', 'devcvus7v')

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  return await response.json()
}

export { uploadImage }
