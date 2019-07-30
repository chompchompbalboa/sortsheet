//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTileItem = ({
  children
}: SettingsTileItemProps) => (
  <Container>
    {children}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SettingsTileItemProps = {
  children?: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
`

export default SettingsTileItem