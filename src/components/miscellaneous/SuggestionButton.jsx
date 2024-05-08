import propTypes from 'prop-types'
import { Button } from '@chakra-ui/react'

import { ChatState } from '@context'

const SuggestionButton = ({ suggestion, setNewMessage }) => {
  const { suggestionSettings } = ChatState()

  const updateChatMessage = () => {
    if (suggestionSettings.useMultipleSuggestions) {
      setNewMessage((prevMessage) => prevMessage + ' ' + suggestion)
    } else {
      setNewMessage(suggestion)
    }
  }

  return (
    <Button
      onClick={updateChatMessage}
      size="sm"
      variant="outline"
      colorScheme="purple"
      height="fit-content"
      ml="2"
      my="1"
      py="1.5"
      px="2"
      cursor="pointer"
      _focus={{
        bg: '#7239bbd0',
        color: 'white',
      }}>
      {suggestion}
    </Button>
  )
}

SuggestionButton.propTypes = {
  suggestion: propTypes.string,
  setNewMessage: propTypes.func,
}

SuggestionButton.defaultProps = {
  suggestion: '',
  setNewMessage: () => {},
}

export default SuggestionButton
