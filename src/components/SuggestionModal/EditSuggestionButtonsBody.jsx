import { useState } from 'react'
import { ModalBody, Box, FormControl, Button, Textarea, ModalFooter } from '@chakra-ui/react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { SUGGESTIONS } from '@fakeDB'
import { ChatState } from '@context'
import { dropChatTemplateButtons, setChatTemplateButtons, getChatTemplateButtons } from '@utils'

import DropBox from '../DropBox/DropBox'

const BUTTONS_CONTAINER_ID = 'EDITABLE_BUTTONS'
const DROP_BOX_ID = 'DROP_BOX'

const EditSuggestionButtonsBody = () => {
  const { suggestions, setSuggestions } = ChatState()
  const [chatSuggestion, setChatSuggestion] = useState('')
  const [isDropBoxHover, setIsDropBoxHover] = useState(false)

  const createNewChatSuggestion = () => {
    if (chatSuggestion.trim().length >= 3) {
      setChatTemplateButtons(chatSuggestion)
      setSuggestions([...getChatTemplateButtons(), ...SUGGESTIONS])
      setChatSuggestion('')
    }
  }

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId: destinationDroppableId } = destination || {}

    if (destinationDroppableId === DROP_BOX_ID) {
      dropChatTemplateButtons(draggableId)
      setSuggestions([...getChatTemplateButtons(), ...SUGGESTIONS])
    }
    setIsDropBoxHover(false)
  }

  const onDragUpdate = (props) => {
    const { droppableId: destinationDroppableId } = props?.destination || {}
    if (destinationDroppableId === DROP_BOX_ID) {
      setIsDropBoxHover(true)
    } else {
      setIsDropBoxHover(false)
    }
  }

  return (
    <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <ModalBody pb="0">
        <FormControl>
          <Textarea
            placeholder="Suggestion (btn modifiable)"
            value={chatSuggestion}
            onChange={(e) => setChatSuggestion(e.target.value)}
          />
          <Button variant="solid" colorScheme="purple" width="100%" mt="2" onClick={createNewChatSuggestion}>
            Ajouter suggestion
          </Button>
        </FormControl>

        <Droppable droppableId={BUTTONS_CONTAINER_ID}>
          {(provided) => (
            <Box h="30rem" overflowY="auto" mt="3" ref={provided.innerRef} {...provided.droppableProps}>
              {suggestions.map((suggestion, index) => (
                <Draggable key={suggestion.id} draggableId={suggestion.id} index={index}>
                  {(provided) => (
                    <Box
                      display="inline-block"
                      bg="purple.50"
                      color="purple"
                      border="1px solid purple"
                      borderRadius="md"
                      py="0.5"
                      px="1"
                      my="0.5"
                      mr="2"
                      _active={{
                        bg: 'purple.600',
                        color: 'white',
                      }}
                      key={index}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      {suggestion.message}{' '}
                      {suggestion.required && (
                        <Box display="inline" alignSelf="center" color="red">
                          *
                        </Box>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </ModalBody>
      <ModalFooter pt="0" pb="2">
        <DropBox isDropBoxHover={isDropBoxHover} boxId={DROP_BOX_ID} />
      </ModalFooter>
    </DragDropContext>
  )
}

export default EditSuggestionButtonsBody
