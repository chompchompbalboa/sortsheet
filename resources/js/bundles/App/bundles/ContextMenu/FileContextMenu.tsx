//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FileContextMenu = ({
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
}: FileContextMenuProps) => {

  return (
    <ContextMenu
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <ContextMenuItem text="Open" />
      <ContextMenuDivider />
      <ContextMenuItem text="Cut" />
      <ContextMenuItem text="Copy" />
      <ContextMenuItem text="Paste" />
      <ContextMenuDivider />
      <ContextMenuItem text="Rename" />
      <ContextMenuDivider />
      <ContextMenuItem text="Delete" />
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FileContextMenuProps {
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FileContextMenu
