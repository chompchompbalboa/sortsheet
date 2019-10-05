//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell } from '@app/state/sheet/types'

import { updateSheet, updateSheetCellReducer } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const updateSheetSelectionFromCellClick = (sheetId: string, cellId: string, isShiftClicked: boolean): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      allSheetRows,
      allSheets: {
        [sheetId]: { 
          selections,
          visibleColumns,
          visibleRows,
        }
      }
    } = getState().sheet
    const cell = allSheetCells[cellId]

    const selectCell = () => {
      batch(() => {
        const nextSelectionsRangeCellIds = selections.rangeCellIds.size > 0 ? new Set() as Set<ISheetCell['id']> : selections.rangeCellIds
        dispatch(updateSheetCellReducer(selections.rangeStartCellId, {
          isCellSelected: false
        }))
        dispatch(updateSheetCellReducer(cell.id, { isCellSelected: true }))
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            rangeCellIds: nextSelectionsRangeCellIds,
            rangeStartCellId: cell.id,
            rangeStartColumnId: cell.columnId,
            rangeStartRowId: cell.rowId,
            rangeEndCellId: null,
            rangeEndColumnId: null,
            rangeEndRowId: null
          }
        }, true))
      })
    }

    if(!isShiftClicked) {
      selectCell()
    }
    else if(isShiftClicked) {
      // Range start and end column and row indexes
      const cellColumnIndex = visibleColumns.indexOf(cell.columnId)
      const cellRowIndex = visibleRows.indexOf(cell.rowId)
      const rangeStartColumnIndex = visibleColumns.indexOf(selections.rangeStartColumnId)
      const rangeStartRowIndex = visibleRows.indexOf(selections.rangeStartRowId)
      const rangeEndColumnIndex = Math.max(...[cellColumnIndex, visibleColumns.indexOf(selections.rangeEndColumnId)].filter(value => value !== null))
      const rangeEndRowIndex = Math.max(...[cellRowIndex, visibleRows.indexOf(selections.rangeEndRowId)].filter(value => value !== null))
      if(cellColumnIndex < rangeStartColumnIndex || cellRowIndex < rangeStartRowIndex) {
        selectCell()
      }
      else {
        // Next sheet selection cell ids
        const nextSheetSelectionRangeCellIds = new Set([ ...selections.rangeCellIds ])
        for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
          const rowId = visibleRows[rowIndex]
          if(rowId !== 'ROW_BREAK') {
            const row = allSheetRows[rowId]
            for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
              const columnId = visibleColumns[columnIndex]
              if(columnId !== 'COLUMN_BREAK') {
                const cellId = row.cells[columnId]
                nextSheetSelectionRangeCellIds.add(cellId)
              }
            }
          }
        }
      
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            rangeCellIds: nextSheetSelectionRangeCellIds,
            rangeEndCellId: cell.id,
            rangeEndColumnId: visibleColumns[rangeEndColumnIndex],
            rangeEndRowId: visibleRows[rangeEndRowIndex],
          }
        }, true))
      }
    }
  }
}