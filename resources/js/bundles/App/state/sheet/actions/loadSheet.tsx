//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, ISheetFromDatabase,
  IAllSheetCells, ISheetCell,
  IAllSheetColumns, ISheetColumn,
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetRows
} from '@app/state/sheet/types'

import { loadSheetReducer } from '@app/state/sheet/actions'

import { defaultSheetSelections } from '@app/state/sheet/defaults'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
 } from '@app/state/sheet/resolvers'
//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const loadSheet = (sheetFromDatabase: ISheetFromDatabase): IThunkAction => {

	return async (dispatch: IThunkDispatch) => {

    // Rows and cells
    const normalizedRows: IAllSheetRows = {}
    const normalizedCells: IAllSheetCells = {}
    const sheetRows: ISheetColumn['id'][] = []
    sheetFromDatabase.rows.forEach(row => { 
      let rowCells: { [columnId: string]: ISheetCell['id'] }  = {}
      row.cells.forEach(cell => {
        normalizedCells[cell.id] = { 
          ...cell, 
          isCellEditing: false,
          isCellSelected: false,
        }
        rowCells[cell.columnId] = cell.id
      })
      normalizedRows[row.id] = { id: row.id, sheetId: sheetFromDatabase.id, cells: rowCells}
      sheetRows.push(row.id)
    })

    // Columns
    const normalizedColumns: IAllSheetColumns = {}
    const sheetColumns: ISheetColumn['id'][] = []
    sheetFromDatabase.columns.forEach(column => { 
      normalizedColumns[column.id] = column 
      sheetColumns.push(column.id)
    })

    // Filters
    const normalizedFilters: IAllSheetFilters = {}
    const sheetFilters: ISheetFilter['id'][] = []
    sheetFromDatabase.filters.forEach((filter: ISheetFilter) => { 
      normalizedFilters[filter.id] = filter 
      sheetFilters.push(filter.id)
    })

    // Groups
    const normalizedGroups: IAllSheetGroups = {}
    const sheetGroups: ISheetGroup['id'][] = []
    sheetFromDatabase.groups.forEach(group => { 
      normalizedGroups[group.id] = group 
      sheetGroups.push(group.id)
    })

    // Sorts
    const normalizedSorts: IAllSheetSorts = {}
    const sheetSorts: ISheetSort['id'][] = []
    sheetFromDatabase.sorts.forEach(sort => { 
      normalizedSorts[sort.id] = sort 
      sheetSorts.push(sort.id)
    })
    
    // New Sheet
    const newSheet: ISheet = {
      id: sheetFromDatabase.id,
      sourceSheetId: sheetFromDatabase.sourceSheetId,
      defaultVisibleRows: sheetFromDatabase.defaultVisibleRows.filter(visibleRowId => sheetRows.includes(visibleRowId)),
      fileType: sheetFromDatabase.fileType,
      columns: sheetColumns,
      filters: sheetFilters,
      groups: sheetGroups,
      rowLeaders: null,
      rows: sheetRows,
      sorts: sheetSorts,
      visibleColumns: sheetFromDatabase.visibleColumns !== null ? sheetFromDatabase.visibleColumns.filter(visibleColumnId => sheetColumns.includes(visibleColumnId) || visibleColumnId === 'COLUMN_BREAK') : sheetColumns,
      visibleRows: null,
      selections: defaultSheetSelections,
      styles: {
        id: sheetFromDatabase.styles.id,
        backgroundColor: new Set(sheetFromDatabase.styles.backgroundColor) as Set<string>,
        backgroundColorReference: sheetFromDatabase.styles.backgroundColorReference || {},
        bold: new Set(sheetFromDatabase.styles.bold) as Set<string>,
        color: new Set(sheetFromDatabase.styles.color) as Set<string>,
        colorReference: sheetFromDatabase.styles.colorReference || {},
        italic: new Set(sheetFromDatabase.styles.italic) as Set<string>,
      }
    }

    const nextSheetVisibleRows = resolveSheetVisibleRows(newSheet, normalizedRows, normalizedCells, normalizedFilters, normalizedGroups, normalizedSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    
		dispatch(
			loadSheetReducer(
        {
          ...newSheet,
          visibleRows: nextSheetVisibleRows,
          rowLeaders: nextSheetRowLeaders
        },
        normalizedCells,
        normalizedColumns,
        normalizedFilters,
        normalizedGroups,
        normalizedRows,
        normalizedSorts,
			)
		)
	}
}