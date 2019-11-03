//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, ARROW_UP } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetRows,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCreateRows = ({
  sheetId
}: ISheetCreateRowsProps) => {

  const dispatch = useDispatch()
  
  const autosizeInput = useRef(null)
  
  const [ insertAboveOrBelowSelectedRow, setInsertAboveOrBelowSelectedRow ] = useState('ABOVE')

  const sheetSelections = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const [ isEditingInputValue, setIsEditingInputValue ] = useState(false)
  const [ inputValue, setInputValue ] = useState(1)
  
  useEffect(() => {
    if(isEditingInputValue) { window.addEventListener('keydown', createRowsOnKeydownEnter) }
    else { window.removeEventListener('keydown', createRowsOnKeydownEnter) }
    return () => window.removeEventListener('keydown', createRowsOnKeydownEnter)
  }, [ inputValue, isEditingInputValue ])

  const createRows = (aboveOrBelow: 'ABOVE' | 'BELOW') => {
    setInsertAboveOrBelowSelectedRow(aboveOrBelow)
    setTimeout(() => {
      dispatch(createSheetRows(
        sheetId, 
        inputValue, 
        sheetSelections.rangeStartRowId, 
        aboveOrBelow === 'ABOVE' ? 'ABOVE' : 'BELOW',
        true
      ))
    }, 10)
  }
  
  const handleAutosizeInputFocus = () => {
    setIsEditingInputValue(true)
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }
  const handleAutosizeInputBlur = () => {
    setIsEditingInputValue(false)
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }
  
  const createRowsOnKeydownEnter = (e: KeyboardEvent) => { 
    if(e.key === 'Enter') { 
      autosizeInput.current.blur()
      setIsEditingInputValue(false)
      createRows(insertAboveOrBelowSelectedRow as 'ABOVE' | 'BELOW') 
    } 
  }

  return (
    <Container>
      <AddContainer>
        <AutosizeInput
          ref={autosizeInput}
          value={inputValue === 0 ? '' : inputValue}
          onBlur={() => handleAutosizeInputBlur()}
          onChange={e => setInputValue(Math.min(Number(e.target.value), 25))}
          onFocus={() => handleAutosizeInputFocus()}
          inputStyle={{
            padding: '0.3rem',
            paddingLeft: '0.5rem',
            minWidth: '0.5rem',
            border: 'none',
            borderTop: '0.5px solid rgb(200, 200, 200)',
            borderBottom: '0.5px solid rgb(200, 200, 200)',
            borderLeft: '0.5px solid rgb(200, 200, 200)',
            borderTopLeftRadius: '3px',
            borderBottomLeftRadius: '3px',
            color: 'rgb(110, 110, 110)',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            fontWeight: 'inherit'}}/>
      </AddContainer>
      <AboveOrBelowButtons>
        <AboveButton
          isSelected={insertAboveOrBelowSelectedRow === 'ABOVE'}
          onClick={() => createRows('ABOVE')}
          userColorPrimary={userColorPrimary}>
          <Icon
            icon={ARROW_UP}
            size="0.6rem"/>
        </AboveButton>
        <BelowButton
          isSelected={insertAboveOrBelowSelectedRow === 'BELOW'}
          onClick={() => createRows('BELOW')}
          userColorPrimary={userColorPrimary}>
          <Icon
            icon={ARROW_DOWN}
            size="0.6rem"/>
        </BelowButton>
      </AboveOrBelowButtons>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCreateRowsProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AboveOrBelowButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const AboveOrBelowButton = styled.div`
  cursor: pointer;  
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${ ({ isSelected, userColorPrimary }: IAboveOrBelowButton ) => isSelected ? userColorPrimary : 'rgb(220, 220, 220)' };
  color: ${ ({ isSelected }: IAboveOrBelowButton ) => isSelected ? 'rgb(240, 240, 240)' : 'inherit' };
  padding: 0.125rem 0.1875rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ userColorPrimary }: IAboveOrBelowButton ) => userColorPrimary };
    color: rgb(240, 240, 240);
  }
`
interface IAboveOrBelowButton {
  isSelected: boolean
  userColorPrimary: string
}

const AboveButton = styled(AboveOrBelowButton)`
  border-top: 1px solid rgb(200, 200, 200);
  border-right: 1px solid rgb(200, 200, 200);
  border-top-right-radius: 3px;
`

const BelowButton = styled(AboveOrBelowButton)`
  border-bottom: 1px solid rgb(200, 200, 200);
  border-right: 1px solid rgb(200, 200, 200);
  border-bottom-right-radius: 3px;
`

const AddContainer = styled.div`
  display: flex;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRows
