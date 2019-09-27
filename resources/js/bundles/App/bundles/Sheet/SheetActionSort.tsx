//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import { 
  ISheet, 
  ISheetColumn, 
  IAllSheetColumns, 
  ISheetSort, 
  IAllSheetSorts 
} from '@app/state/sheet/types'

import { ThunkDispatch } from '@app/state/types'
import { SheetSortUpdates } from '@app/state/sheet/types'
import { 
  createSheetSort as createSheetSortAction,
  deleteSheetSort as deleteSheetSortAction,
  updateSheetSort as updateSheetSortAction 
} from '@app/state/sheet/actions'

import SheetAction from '@app/bundles/Sheet/SheetAction'
import SheetActionDropdown, { SheetActionDropdownOption } from '@app/bundles/Sheet/SheetActionDropdown'
import SheetActionSortSelectedOption from '@app/bundles/Sheet/SheetActionSortSelectedOption'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch, props: SheetActionProps) => ({
  createSheetSort: (newSort: ISheetSort) => dispatch(createSheetSortAction(props.sheetId, newSort)),
  deleteSheetSort: (columnId: string) => dispatch(deleteSheetSortAction(props.sheetId, columnId)),
  updateSheetSort: (sheetId: ISheet['id'], sortId: string, updates: SheetSortUpdates, skipVisibleRowsUpdate?: boolean) => dispatch(updateSheetSortAction(sheetId, sortId, updates, skipVisibleRowsUpdate))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSort = ({
  sheetId,
  columns,
  createSheetSort,
  deleteSheetSort,
  sorts,
  sheetSorts,
  sheetVisibleColumns,
  updateSheetSort
}: SheetActionProps) => {

  const options = sheetVisibleColumns && sheetVisibleColumns.map((columnId: string) => {
    if(columns && columns[columnId]) {
      return { label: columns[columnId].name, value: columnId }
    }
  }).filter(Boolean)
  
  const selectedOptions = sheetSorts && sheetSorts.map((sortId: ISheetSort['id']) => { 
    const sort = sorts[sortId]
    return { label: columns[sort.columnId].name, value: sortId, isLocked: sort.isLocked }
  })

  return (
    <SheetAction>
      <SheetActionDropdown
        sheetId={sheetId}
        onOptionDelete={(optionToDelete: SheetActionDropdownOption) => deleteSheetSort(optionToDelete.value)}
        onOptionSelect={(selectedOption: SheetActionDropdownOption) => createSheetSort({ id: createUuid(), sheetId: sheetId, columnId: selectedOption.value, order: 'ASC', isLocked: false })}
        onOptionUpdate={(sortId, updates) => updateSheetSort(sheetId, sortId, updates, true)}
        options={options}
        placeholder={"Sort By..."}
        selectedOptions={selectedOptions}
        selectedOptionComponent={({ option }: { option: SheetActionDropdownOption }) => <SheetActionSortSelectedOption option={option} sorts={sorts} updateSheetSort={(...args) => updateSheetSort(sheetId, ...args)} />}/>
    </SheetAction>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionProps {
  columns: IAllSheetColumns
  createSheetSort?(newSort: ISheetSort): void
  deleteSheetSort?(columnId: string): void
  updateSheetSort?(sheetId: ISheet['id'], sortId: string, updates: SheetSortUpdates, skipVisibleRowsUpdate?: boolean): void
  sorts: IAllSheetSorts
  sheetSorts: ISheetSort['id'][]
  sheetVisibleColumns: ISheetColumn['id'][]
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  null,
  mapDispatchToProps
)(SheetActionSort)
