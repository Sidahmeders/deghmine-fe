export const CHAT_EVENT_LISTENERS = {
  SETUP: 'setup',
  CONNECTED: 'connected',
  CHAT_ERROR: 'chat error',
  JOIN_CHAT: 'join chat',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  NEW_MESSAGE: 'new message',
  UPDATE_GROUP: 'update group',
  DELETE_CHAT: 'delete chat',
}

export const SUGGESTIONS_CONTAINER_HEIGHTS = {
  small: '52px',
  medium: '124px',
  large: '300px',
}

export const SUGGESTIONS_CONTAINER_DIRECTION = {
  row: 'ROW',
  column: 'COLUMN',
}

export const SUGGESTION_SETTINGS = {
  showSuggestions: false,
  filterSuggestions: false,
  useMultipleSuggestions: false,
  direction: SUGGESTIONS_CONTAINER_DIRECTION.row,
  size: SUGGESTIONS_CONTAINER_HEIGHTS.small,
}
