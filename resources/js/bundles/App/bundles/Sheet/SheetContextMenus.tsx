//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Sheet, SheetActiveUpdates, SheetUpdates, SheetColumn, SheetColumns, SheetColumnUpdates } from '@app/state/sheet/types'

import SheetColumnContextMenu from '@app/bundles/ContextMenu/SheetColumnContextMenu'
import SheetRowContextMenu from '@app/bundles/ContextMenu/SheetRowContextMenu'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetContextMenus = ({
  sheetId,
  isContextMenuVisible,
  columns,
  contextMenuType,
  contextMenuIndex,
  contextMenuId,
  contextMenuTop,
  contextMenuLeft,
  contextMenuRight,
  closeContextMenu,
  sheetVisibleColumns,
  updateSheet,
  updateSheetActive,
  updateSheetColumn
}: SheetContextMenusProps) => {
  return (
  <Container>
    {isContextMenuVisible && contextMenuType === 'COLUMN' &&
      <SheetColumnContextMenu
        sheetId={sheetId}
        columnIndex={contextMenuIndex}
        columnId={contextMenuId}
        columns={columns}
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        contextMenuRight={contextMenuRight}
        closeContextMenu={() => closeContextMenu()}
        sheetVisibleColumns={sheetVisibleColumns}
        updateSheet={updateSheet}
        updateSheetActive={updateSheetActive}
        updateSheetColumn={updateSheetColumn}/>}
    {isContextMenuVisible && contextMenuType === 'ROW' &&
      <SheetRowContextMenu
        sheetId={sheetId}
        rowId={contextMenuId}
        contextMenuTop={contextMenuTop}
        contextMenuLeft={contextMenuLeft}
        closeContextMenu={() => closeContextMenu()}/>}
  </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetContextMenusProps {
  sheetId: Sheet['id']
  isContextMenuVisible: boolean
  columns: SheetColumns
  contextMenuType: string
  contextMenuId: string
  contextMenuIndex?: number
  contextMenuTop: number
  contextMenuLeft: number
  contextMenuRight: number
  closeContextMenu(): void
  sheetVisibleColumns: SheetColumn['id'][]
  updateSheet(sheetId: string, updates: SheetUpdates): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetContextMenus
