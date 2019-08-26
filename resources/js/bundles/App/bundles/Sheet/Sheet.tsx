//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import { areEqual } from 'react-window'
import { batch, connect } from 'react-redux'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  createSheetRow as createSheetRowAction,
  loadSheet as loadSheetAction,
  updateSheet as updateSheetAction,
  updateSheetActive as updateSheetActiveAction,
  updateSheetCell as updateSheetCellAction,
  updateSheetSelection as updateSheetSelectionAction,
  updateSheetColumn as updateSheetColumnAction
} from '@app/state/sheet/actions'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetActiveUpdates,
  SheetColumn, SheetColumns, SheetColumnUpdates, 
  SheetCellUpdates, 
  SheetFilter, SheetFilters, 
  SheetGroup, SheetGroups, 
  SheetRow, SheetRows, 
  SheetSort, SheetSorts 
} from '@app/state/sheet/types'
import {  
  selectColumns, 
  selectFilters,
  selectGroups,
  selectRows,
  selectSorts,
  selectSheetColumns,
  selectSheetFilters,
  selectSheetGroups,
  selectSheetSorts,
  selectSheetSourceSheetId,
  selectSheetVisibleColumns,
  selectSheetVisibleRows
} from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'
import { 
  selectUserColorSecondary
} from '@app/state/user/selectors'

import LoadingTimer from '@/components/LoadingTimer'
import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetContextMenus from '@app/bundles/Sheet/SheetContextMenus'
import SheetGrid from '@app/bundles/Sheet/SheetGrid'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  columns: selectColumns(state),
  filters: selectFilters(state),
  groups: selectGroups(state),
  rows: selectRows(state),
  sorts: selectSorts(state),
  sheetColumns: selectSheetColumns(state, props.id),
  sheetFilters: selectSheetFilters(state, props.id),
  sheetGroups: selectSheetGroups(state, props.id),
  sheetSorts: selectSheetSorts(state, props. id),
  sheetVisibleRows: selectSheetVisibleRows(state, props.id),
  sheetVisibleColumns: selectSheetVisibleColumns(state, props.id),
  sourceSheetId: selectSheetSourceSheetId(state, props.id),
  userColorSecondary: selectUserColorSecondary(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createSheetRow: (sheetId: string, sourceSheetId: string) => dispatch(createSheetRowAction(sheetId, sourceSheetId)),
  loadSheet: (sheet: SheetFromServer) => dispatch(loadSheetAction(sheet)),
  updateSheet: (sheetId: string, updates: SheetUpdates) => dispatch(updateSheetAction(sheetId, updates)),
  updateSheetActive: (updates: SheetActiveUpdates) => dispatch(updateSheetActiveAction(updates)),
  updateSheetCell: (cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean) => dispatch(updateSheetCellAction(cellId, updates, undoUpdates, skipServerUpdate)),
  updateSheetColumn: (columnId: string, updates: SheetColumnUpdates) => dispatch(updateSheetColumnAction(columnId, updates)),
  updateSheetSelection: (cellId: string, isShiftPressed: boolean) => dispatch(updateSheetSelectionAction(cellId, isShiftPressed))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTabId,
  columns,
  createSheetRow,
  fileId,
  filters,
  groups,
  id,
  loadSheet,
  rows,
  sheetColumns,
  sheetFilters,
  sheetGroups,
  sheetSorts,
  sheetVisibleRows,
  sheetVisibleColumns,
  sorts,
  sourceSheetId,
  updateSheet,
  updateSheetActive,
  updateSheetCell,
  updateSheetColumn,
  updateSheetSelection,
  userColorSecondary
}: SheetComponentProps) => {
  
  const isActiveFile = fileId === activeTabId
  const memoizedCreateSheetRow = useCallback((id, sourceSheetId) => createSheetRow(id, sourceSheetId), [])
  const memoizedUpdateSheet = useCallback((sheetId, updates) => updateSheet(sheetId, updates), [])
  const memoizedUpdateSheetActive = useCallback((updates) => updateSheetActive(updates), [])
  const memoizedUpdateSheetCell = useCallback((cellId, updates, undoUpdates, skipServerUpdate) => updateSheetCell(cellId, updates, undoUpdates, skipServerUpdate), [])
  const memoizedUpdateSheetColumn = useCallback((columnId, updates) => updateSheetColumn(columnId, updates), [])
  const memoizedUpdateSheetSelection = useCallback((cellId, isShiftPressed) => updateSheetSelection(cellId, isShiftPressed), [])

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTabId ])

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuType, setContextMenuType ] = useState(null)
  const [ contextMenuId, setContextMenuId ] = useState(null)
  const [ contextMenuIndex, setContextMenuIndex ] = useState(null)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ contextMenuRight, setContextMenuRight ] = useState(null)
  const handleContextMenu = useCallback((e: MouseEvent, type: string, id: string, index?: number) => {
    e.preventDefault()
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    batch(() => {
      setIsContextMenuVisible(true)
      setContextMenuType(type)
      setContextMenuId(id)
      setContextMenuIndex(index)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX > (windowWidth * 0.75) ? null : e.clientX)
      setContextMenuRight(e.clientX > (windowWidth * 0.75) ? windowWidth - e.clientX : null)
    })
  }, [])
  const closeContextMenu = () => {
    batch(() => {
      setIsContextMenuVisible(false)
      setContextMenuType(null)
      setContextMenuId(null)
      setContextMenuIndex(null)
      setContextMenuTop(null)
      setContextMenuLeft(null)
      setContextMenuRight(null)
    })
  }

  return (
    <Container>
      <SheetContainer>
        <SheetContextMenus
          sheetId={id}
          isContextMenuVisible={isContextMenuVisible}
          columns={columns}
          contextMenuType={contextMenuType}
          contextMenuIndex={contextMenuIndex}
          contextMenuId={contextMenuId}
          contextMenuTop={contextMenuTop}
          contextMenuLeft={contextMenuLeft}
          contextMenuRight={contextMenuRight}
          closeContextMenu={closeContextMenu}
          sheetVisibleColumns={sheetVisibleColumns}
          updateSheet={memoizedUpdateSheet}
          updateSheetActive={memoizedUpdateSheetActive}
          updateSheetColumn={memoizedUpdateSheetColumn}/>
        <SheetActions
          sheetId={id}
          sourceSheetId={sourceSheetId}
          columns={columns}
          createSheetRow={memoizedCreateSheetRow}
          filters={filters}
          groups={groups}
          sheetFilters={sheetFilters}
          sheetGroups={sheetGroups}
          sheetSorts={sheetSorts}
          sheetVisibleColumns={sheetVisibleColumns}
          sorts={sorts}/>
        {!hasLoaded
          ? isActiveFile ? <LoadingTimer fromId={id}/> : null
          : <SheetGrid
              columns={columns}
              handleContextMenu={handleContextMenu}
              highlightColor={userColorSecondary}
              rows={rows}
              sheetId={id}
              updateSheetCell={memoizedUpdateSheetCell}
              sheetVisibleColumns={sheetVisibleColumns}
              sheetVisibleRows={sheetVisibleRows}
              updateSheetActive={memoizedUpdateSheetActive}
              updateSheetColumn={memoizedUpdateSheetColumn}
              updateSheetSelection={memoizedUpdateSheetSelection}/>
        }
        </SheetContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetComponentProps {
  activeTabId?: string
  columns?: SheetColumns
  createSheetRow?(sheetId: string, sourceSheetId: string): void
  fileId: string
  filters?: SheetFilters
  groups?: SheetGroups
  id: Sheet['id']
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: SheetRows
  sheetColumns?: SheetColumn['id'][]
  sheetFilters?: SheetFilter['id'][]
  sheetGroups?: SheetGroup['id'][]
  sheetSorts?: SheetSort['id'][]
  sheetVisibleColumns?: SheetColumn['id'][]
  sheetVisibleRows?: SheetRow['id'][]
  sorts?: SheetSorts
  sourceSheetId?: string
  updateSheet?(sheetId: string, updates: SheetUpdates): void
  updateSheetActive?(updates: SheetActiveUpdates): void
  updateSheetCell?(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetColumn?(columnId: string, updates: SheetColumnUpdates): void
  updateSheetSelection?(cellId: string, isShiftPressed: boolean): void
  userColorSecondary?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const SheetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  height: calc(100% - 4.075rem);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
