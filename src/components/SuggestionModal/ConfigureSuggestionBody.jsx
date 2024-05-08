import { useEffect } from 'react'
import { ModalBody, Box, Stack, Checkbox, RadioGroup, Radio, FormLabel } from '@chakra-ui/react'

import { ChatState } from '@context'
import { SUGGESTIONS_CONTAINER_DIRECTION, SUGGESTIONS_CONTAINER_HEIGHTS } from '@config'
import { setChatSuggestionSettings } from '@utils'
import { omit } from 'lodash'

const ConfigureSuggestionBody = () => {
  const {
    suggestionSettings,
    setSuggestionSettings,
    suggestionContainerDirection,
    setSuggestionContainerDirection,
    suggestionContainerHeight,
    setSuggestionContainerHeight,
  } = ChatState()

  const suggestionSettingsCheckboxes = omit(suggestionSettings, ['direction', 'size'])
  const allChecked = Object.values(suggestionSettingsCheckboxes).every(Boolean)
  const isIndeterminate = Object.values(suggestionSettingsCheckboxes).some(Boolean) && !allChecked

  const onShowSuggestion = (e) => {
    setSuggestionSettings({
      ...suggestionSettings,
      showSuggestions: e.target.checked,
      filterSuggestions: e.target.checked,
      useMultipleSuggestions: e.target.checked,
    })
  }

  const onShowFilterSuggestions = (e) => {
    setSuggestionSettings({
      ...suggestionSettings,
      showSuggestions: true,
      filterSuggestions: e.target.checked,
    })
  }

  const onShowUseMultipleSuggestions = (e) => {
    setSuggestionSettings({
      ...suggestionSettings,
      showSuggestions: true,
      useMultipleSuggestions: e.target.checked,
    })
  }

  useEffect(() => {
    setChatSuggestionSettings({
      ...suggestionSettings,
      direction: suggestionContainerDirection,
      size: suggestionContainerHeight,
    })
  }, [suggestionSettings, suggestionContainerDirection, suggestionContainerHeight])

  useEffect(() => {
    if (suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.row) {
      setSuggestionContainerHeight(SUGGESTIONS_CONTAINER_HEIGHTS.small)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionContainerDirection])

  return (
    <ModalBody pb="6">
      <Box>
        <Checkbox isIndeterminate={isIndeterminate} isChecked={allChecked} onChange={onShowSuggestion}>
          Afficher la boîte de suggestion
        </Checkbox>
        <Stack pl={6} mt={1} spacing={1}>
          <Checkbox isChecked={suggestionSettings.filterSuggestions} onChange={onShowFilterSuggestions}>
            Filtrer les suggestions lors de la saisie
          </Checkbox>
          <Checkbox isChecked={suggestionSettings.useMultipleSuggestions} onChange={onShowUseMultipleSuggestions}>
            Utiliser plusieurs suggestions à la fois
          </Checkbox>
        </Stack>
      </Box>

      <Stack mt="3">
        <FormLabel m="0">sens de défilement des suggestions</FormLabel>
        <RadioGroup
          colorScheme="blue"
          onChange={setSuggestionContainerDirection}
          defaultValue={suggestionContainerDirection}>
          <Stack spacing={4} direction="row">
            <Radio value={SUGGESTIONS_CONTAINER_DIRECTION.row}>défilement horizontal</Radio>
            <Radio value={SUGGESTIONS_CONTAINER_DIRECTION.column}>défilement vertical</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      {suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.column && (
        <Stack mt="3">
          <FormLabel m="0">Hauteur du conteneur (boîte) de suggestions</FormLabel>
          <RadioGroup
            colorScheme="blue"
            onChange={setSuggestionContainerHeight}
            defaultValue={suggestionContainerHeight}>
            <Stack spacing={4} direction="row">
              <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.small}>petit ({SUGGESTIONS_CONTAINER_HEIGHTS.small})</Radio>
              <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.medium}>moyen ({SUGGESTIONS_CONTAINER_HEIGHTS.medium})</Radio>
              <Radio value={SUGGESTIONS_CONTAINER_HEIGHTS.large}>grand ({SUGGESTIONS_CONTAINER_HEIGHTS.large})</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      )}
    </ModalBody>
  )
}

export default ConfigureSuggestionBody
