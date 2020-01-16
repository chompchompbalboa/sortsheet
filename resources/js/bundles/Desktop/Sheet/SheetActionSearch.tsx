//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  updateSheetView
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSearch = ({
  sheetId
}: ISheetActionSearch) => {

  // Refs
  const updateSheetViewSearchValueTimeout = useRef(0)

  // Redux
  const dispatch = useDispatch()
  const activeSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  
  // State
  const [ searchValue, setSearchValue ] = useState('')

  // Effects
  useEffect(() => {
    clearTimeout(updateSheetViewSearchValueTimeout.current)
    if(searchValue !== '') {
      updateSheetViewSearchValueTimeout.current = setTimeout(() => updateSheetViewSearchValue(searchValue), 1000)
    }
  }, [ searchValue ])

  // Handle Autosize Input Change
  const handleAutosizeInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }

  // Handle Autosize Input Change
  const handleAutosizeInputChange = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue)
  }

  // Handle Autosize Input Change
  const handleAutosizeInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  // Update Sheet View Search Value
  const updateSheetViewSearchValue = (nextSearchValue: string) => {
    dispatch(updateSheetView(activeSheetViewId, {
      searchValue: nextSearchValue
    }, true))
  }

  return (
    <AutosizeInput
      placeholder="Search..."
      value={searchValue}
      onBlur={handleAutosizeInputBlur}
      onChange={e => handleAutosizeInputChange(e.target.value)}
      onFocus={handleAutosizeInputFocus}
      inputStyle={{
        padding: '0.375rem',
        height: '100%',
        minWidth: '5rem',
        border: '0.5px solid rgb(180, 180, 180)',
        borderRadius: '5px',
        backgroundColor: 'transparent',
        outline: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit'}}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSearch {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSearch
