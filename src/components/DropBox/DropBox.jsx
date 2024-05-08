import { Droppable } from 'react-beautiful-dnd'

import './DropBox.scss'

const DropBox = ({ isDropBoxHover, boxId }) => (
  <Droppable droppableId={boxId}>
    {(provided) => (
      <div className="drop-box-container" ref={provided.innerRef} {...provided.droppableProps}>
        <p className="drop-box-text">{isDropBoxHover ? 'relâcher pour supprimer' : 'déposez bouton ici'}</p>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
)

export default DropBox
