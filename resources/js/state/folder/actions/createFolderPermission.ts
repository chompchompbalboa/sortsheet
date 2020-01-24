//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolderPermission } from '@/state/folder/types'

import {
  setAllFolderPermissions,
  setAllFolders
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Folder Permission
//-----------------------------------------------------------------------------
export const createFolderPermission = (newFolderPermissions: IFolderPermission[]): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolderPermissions,
      allFolders
    } = getState().folder
    
    let nextAllFolderPermissions = { ...allFolderPermissions }
    let nextAllFolders = { ...allFolders }
    
    newFolderPermissions.forEach(newFolderPermission => {
      const folder = allFolders[newFolderPermission.folderId]
      const nextFolderPermissions = [
        ...folder.permissions,
        newFolderPermission.id
      ]
      nextAllFolderPermissions = {
        ...nextAllFolderPermissions,
        [newFolderPermission.id]: newFolderPermission
      }
      nextAllFolders = {
        ...nextAllFolders,
        [folder.id]: {
          ...nextAllFolders[folder.id],
          permissions: nextFolderPermissions
        }
      }
    })
    
    dispatch(setAllFolderPermissions(nextAllFolderPermissions))
    dispatch(setAllFolders(nextAllFolders))
  }
}