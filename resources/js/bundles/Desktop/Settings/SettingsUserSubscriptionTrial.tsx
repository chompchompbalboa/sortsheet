//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SettingsUserSubscriptionPurchaseSubscription from '@desktop/Settings/SettingsUserSubscriptionPurchaseSubscription'
import SettingsUserSubscriptionTrialExpirationDate from '@desktop/Settings/SettingsUserSubscriptionTrialExpirationDate'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionTrial = () => {

  return (
    <Container
      data-testid="SettingsUserSubscriptionTrial">
      <SettingsUserSubscriptionTrialExpirationDate />
      <SettingsUserSubscriptionPurchaseSubscription />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionTrial
