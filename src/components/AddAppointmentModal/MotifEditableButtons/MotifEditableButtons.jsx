import { useState } from 'react'
import { ModalBody, ModalFooter, Button, Input, Stack, StackItem, HStack } from '@chakra-ui/react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { getMotifTemplateButtons, setMotifTemplateButtons, dropMotifTemplateButton } from '@utils'

import DropBox from '@components/DropBox/DropBox'

import './MotifEditableButtons.scss'

const BUTTONS_CONTAINER_ID = 'EDITABLE_BUTTONS'
const DROP_BOX_ID = 'DROP_BOX'

const MotifEditableButtons = () => {
  const [value, setValue] = useState('')
  const [templateButtons, setTemplateButtons] = useState(getMotifTemplateButtons())
  const [isDropBoxHover, setIsDropBoxHover] = useState(false)

  const addNewTemplate = () => {
    if (!value?.trim().length) return
    setMotifTemplateButtons(value)
    setValue('')
    setTemplateButtons(getMotifTemplateButtons())
  }

  const onDragEnd = (props) => {
    const { draggableId, destination } = props
    const { droppableId: destinationDroppableId } = destination || {}

    if (destinationDroppableId === DROP_BOX_ID) {
      dropMotifTemplateButton(draggableId)
      setTemplateButtons(getMotifTemplateButtons())
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
    <div className="editable-buttons-container">
      <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <ModalBody pb="0">
          <Droppable droppableId={BUTTONS_CONTAINER_ID}>
            {(provided) => (
              <Stack spacing={4} ref={provided.innerRef} {...provided.droppableProps}>
                <HStack>
                  <Input
                    type="text"
                    placeholder="Motif de consultation (btn modifiable)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <Button colorScheme="blue" ml="0" onClick={addNewTemplate}>
                    Ajouter
                  </Button>
                </HStack>

                <StackItem height="25rem" overflowY="auto">
                  {templateButtons.length ? (
                    templateButtons.map((btn, index) => (
                      <Draggable key={btn.id} draggableId={btn.id} index={index}>
                        {(provided) => (
                          <div
                            className={`editable-button ${btn.isRequired ? 'required' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            {btn.name}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Button size="sm" colorScheme="telegram">
                      exemple (ne s'affichera pas)
                    </Button>
                  )}
                </StackItem>
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </ModalBody>

        <ModalFooter py="0">
          <DropBox isDropBoxHover={isDropBoxHover} boxId={DROP_BOX_ID} />
        </ModalFooter>
      </DragDropContext>
    </div>
  )
}

export default MotifEditableButtons
