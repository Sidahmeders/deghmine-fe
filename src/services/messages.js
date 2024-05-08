import _fetch from './_fetch'

const fetchMessagesByChatId = async (chatId) => await _fetch.GET(`/api/messages/${chatId}`)

const createMessage = async (newMessage, chatId) => {
  return await _fetch.POST('/api/messages', {
    content: newMessage,
    chatId: chatId,
  })
}

const deleteMessages = async (chatId) => await _fetch.DELETE(`/api/messages/${chatId}`)

export { fetchMessagesByChatId, createMessage, deleteMessages }
