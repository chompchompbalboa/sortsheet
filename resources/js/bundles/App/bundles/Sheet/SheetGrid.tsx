//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, forwardRef, memo, MouseEvent, useLayoutEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { areEqual, VariableSizeGrid as Grid } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import Autosizer from 'react-virtualized-auto-sizer'
import SheetCell from '@app/bundles/Sheet/SheetCell'
import SheetBreakCell from '@app/bundles/Sheet/SheetBreakCell'
import SheetHeaders from '@app/bundles/Sheet/SheetHeaders'
import SheetRowLeader from '@app/bundles/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetGrid = memo(({
  handleContextMenu,
  sheetId,
}: SheetGridProps) => {

  const allSheetColumns = useSelector((state: IAppState) => state.sheet.allSheetColumns)
  const allSheetColumnTypes = useSelector((state: IAppState) => state.sheet.allSheetColumnTypes)
  const allSheetRows = useSelector((state: IAppState) => state.sheet.allSheetRows)

  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetActiveSheetViewId] && state.sheet.allSheetViews[sheetActiveSheetViewId].visibleColumns)
  const sheetVisibleRows = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRows)
  const sheetVisibleRowLeaders = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].visibleRowLeaders)

  const grid = useRef()
  useLayoutEffect(() => {
    if(grid && grid.current) { 
    // @ts-ignore
      grid.current.resetAfterColumnIndex(0)
    // @ts-ignore
      grid.current.resetAfterRowIndex(0)
    }
  }, [ allSheetColumns, sheetViewVisibleColumns ])

  const GridWrapper = forwardRef(({ children, ...rest }, ref) => (
    <GridContainer
      //@ts-ignore ref={ref}
      ref={ref} {...rest}>
      <SheetHeaders
        sheetId={sheetId}
        columns={allSheetColumns}
        handleContextMenu={handleContextMenu}
        sheetViewVisibleColumns={sheetViewVisibleColumns}/>
      <GridItems>
        {children}
      </GridItems>
    </GridContainer> 
  ))

  const Cell = ({ 
    columnIndex, 
    rowIndex, 
    style
  }: CellProps) => {
    const columnId = sheetViewVisibleColumns[columnIndex - 1]
    const rowId = sheetVisibleRows[rowIndex]
    if(columnIndex !== 0 && columnId !== 'COLUMN_BREAK' && rowId !== 'ROW_BREAK') {
      return (
        <SheetCell
          cellId={allSheetRows[rowId].cells[columnId]}
          sheetId={sheetId}
          style={style}
          columnType={allSheetColumnTypes[allSheetColumns[columnId].typeId]}/>
      )
    }
    if(columnIndex === 0) {
      return (
        <SheetRowLeader 
          sheetId={sheetId}
          rowId={rowId}
          handleContextMenu={handleContextMenu}
          isRowBreak={rowId === 'ROW_BREAK'}
          style={style}
          text={sheetVisibleRowLeaders[rowIndex]}/>
      )
    }
    return (
      <SheetBreakCell
        style={style}/>
    )
  }
  
  return (
    <Autosizer>
      {({ width, height }) => (
        <Grid
          ref={grid}
          innerElementType={GridWrapper}
          width={width}
          height={height}
          columnWidth={columnIndex => columnIndex === 0 ? 35 : (sheetViewVisibleColumns[columnIndex - 1] === 'COLUMN_BREAK' ? 10 : allSheetColumns[sheetViewVisibleColumns[columnIndex - 1]].width)}
          columnCount={sheetViewVisibleColumns.length + 1}
          rowHeight={rowIndex => 24}
          rowCount={sheetVisibleRows.length}
          overscanColumnCount={sheetViewVisibleColumns.length}
          overscanRowCount={3}>
          {Cell}
        </Grid>
      )}
    </Autosizer>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetGridProps {
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  sheetId: string
}

interface CellProps {
  columnIndex: number
  rowIndex: number
  style: {
    width?: ReactText
  }
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`

const GridItems = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetGrid
