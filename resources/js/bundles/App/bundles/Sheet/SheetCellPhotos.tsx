//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import { SheetColumnType } from '@app/state/sheet/types'

import AutosizeTextArea from 'react-autosize-textarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellPhotosProps) => {
  
  const textarea = useRef(null)
  
  const focusCell = () => {
    const textareaLength = textarea && textarea.current && textarea.current.value && textarea.current.value.length || 0
    textarea.current.focus()
    textarea.current.setSelectionRange(textareaLength,textareaLength)
  }
  
  const safeValue = value === null ? "" : value

  return (
    <SheetCellContainer
      focusCell={focusCell}
      updateCellValue={updateCellValue}
      value={safeValue}
      {...passThroughProps}>
      <StyledTextarea
        ref={textarea}
        onChange={(e: any) => updateCellValue(e.target.value)}
        value={'Photos' + safeValue}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosProps {
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledTextarea = styled(AutosizeTextArea)`
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  -moz-appearance: textfield;
  resize: none;
  white-space: nowrap;
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotos
