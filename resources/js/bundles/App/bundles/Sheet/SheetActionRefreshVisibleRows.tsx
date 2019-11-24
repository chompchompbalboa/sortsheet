//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch } from 'react-redux'

import { REFRESH } from '@app/assets/icons' 

import { refreshSheetVisibleRows } from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionRefreshVisibleRows = ({
  sheetId
}: ISheetActionRefreshVisibleRowsProps) => {
  const dispatch = useDispatch()
  return (
    <SheetActionButton
      icon={REFRESH}
      marginRight="0"
      onClick={() => dispatch(refreshSheetVisibleRows(sheetId))}
      tooltip="Refresh the view"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionRefreshVisibleRowsProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionRefreshVisibleRows
