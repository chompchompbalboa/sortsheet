//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { 
  clearSheetSelection,
  setAllSheetFilters,
  updateSheet
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetFilter = (sheetId: string, filterId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const sheetFilter = allSheetFilters[filterId]

    const { [filterId]: deletedFilter, ...nextAllSheetFilters } = allSheetFilters

    const nextSheetFilters = sheet.filters.filter(sheetFilterId => sheetFilterId !== filterId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, filters: nextSheetFilters}, allSheetRows, allSheetCells, nextAllSheetFilters, allSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(updateSheet(sheetId, {
        filters: nextSheetFilters,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }, true))
    })

    if(sheetFilter.sheetViewId === null) {
      dispatch(setAllSheetFilters(nextAllSheetFilters))
      mutation.deleteSheetFilter(filterId)
    }
	}
}