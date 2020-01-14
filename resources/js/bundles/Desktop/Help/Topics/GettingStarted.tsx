//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@desktop/Content/ContentContent'
import HelpColumn from '@desktop/Help/HelpColumn'
import HelpColumns from '@desktop/Help/HelpColumns'
import HelpImage from '@desktop/Help/HelpImage'
import HelpText from '@desktop/Help/HelpText'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const GettingStarted = () => {

  return (
    <ContentContent>
      <HelpColumns>
        <HelpColumn>
          <HelpText
            containerMarginBottom="0">
            If you haven't signed up for an account yet, please do so but clicking on the link in the top right of the window:
          </HelpText>
        </HelpColumn>
        <HelpColumn>
          <HelpImage
            containerMarginBottom="0"
            containerWidth='18rem'
            src={environment.assetUrl + 'images/help/getting-started/register-link.png'}/>
        </HelpColumn>
      </HelpColumns>
      <HelpColumns>
        <HelpColumn>
          <HelpText
            containerMarginBottom="0">
            This will open the form to register for an account: 
          </HelpText>
        </HelpColumn>
        <HelpColumn>
          <HelpImage
            containerMarginBottom="0"
            containerWidth='25rem'
            src={environment.assetUrl + 'images/help/getting-started/register-form.png'}/>
        </HelpColumn>
      </HelpColumns>
      <HelpColumns>
        <HelpColumn>
          <HelpText
            containerMarginBottom="0">
            Tasksheet is currently in an early-access beta. New registrations require an access code. 
            <br/><br/>
            The access code is: FRIENDS_AND_FAMILY
          </HelpText>
        </HelpColumn>
        <HelpColumn>
          <HelpImage
            containerMarginBottom="0"
            containerWidth='25rem'
            src={environment.assetUrl + 'images/help/getting-started/register-form-with-values.png'}/>
        </HelpColumn>
      </HelpColumns>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default GettingStarted
