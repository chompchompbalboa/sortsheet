//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import moment from 'moment'
import 'jest-styled-components'

import { act, renderWithRedux, fireEvent } from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType
} from '@/testing/mocks'
import { flushPromises } from '@/testing/utils'

import { IUserTasksheetSubscription } from '@/state/user/types'

import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SettingsUserSubscriptionMonthly', () => {

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  
  const settingsUserSubscriptionMonthly = (tasksheetSubscriptionType: IUserTasksheetSubscription['type']) => {
    const mockAppState = getMockAppStateByTasksheetSubscriptionType(tasksheetSubscriptionType)
    const {
      container, 
      debug,
      getByPlaceholderText,
      getByText,
      getByTestId,
      store: { 
        getState 
      }
    } = renderWithRedux(<SettingsUserSubscriptionMonthly />, { store: createMockStore(mockAppState) })
    const cancelSubscriptionButton = getByText("Cancel Subscription")
    const passwordInput = getByPlaceholderText("Enter your password") as HTMLInputElement
    const closePasswordInputButton = getByTestId("ClosePasswordInputButton")
    const cancelSubscriptionMessage = getByTestId("CancelSubscriptionMessage")
    return {
      cancelSubscriptionButton,
      cancelSubscriptionMessage,
      closePasswordInputButton,
      container,
      debug,
      getState,
      passwordInput
    }
  }

  it("displays the next billing date correctly for a MONTHLY user whose subscription is active", () => {
    const { container, getState } = settingsUserSubscriptionMonthly('MONTHLY')
    const expectedBillingDate = moment.localeData().ordinal(getState().user.tasksheetSubscription.billingDayOfMonth)
    expect(container.textContent).toContain(expectedBillingDate)
  })

  it("displays a 'Cancel Subscription' button", () => {
    const { cancelSubscriptionButton } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(cancelSubscriptionButton).toBeTruthy()
  })

  it("displays an 'Enter your password' input when the 'Cancel Subscription' button is clicked", () => {
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(passwordInput).toHaveStyleRule('display', 'none')
    cancelSubscriptionButton.click()
    expect(passwordInput).toHaveStyleRule('display', 'block')
    expect(cancelSubscriptionButton.textContent).toContain("Confirm Cancellation")
  })

  it("displays a button that hides the 'Enter your password' input when clicked", () => {
    const { cancelSubscriptionButton, closePasswordInputButton, passwordInput  } = settingsUserSubscriptionMonthly('MONTHLY')
    expect(closePasswordInputButton).toHaveStyleRule('display', 'none')
    expect(passwordInput).toHaveStyleRule('display', 'none')
    cancelSubscriptionButton.click()
    expect(closePasswordInputButton).toHaveStyleRule('display', 'block')
    expect(passwordInput).toHaveStyleRule('display', 'block')
    closePasswordInputButton.click()
    expect(closePasswordInputButton).toHaveStyleRule('display', 'none')
    expect(passwordInput).toHaveStyleRule('display', 'none')
  })

  it("correctly updates the 'Enter your password' input value", () => {
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    expect(passwordInput.value).toEqual("")
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    expect(passwordInput.value).toEqual(testPassword)
  })

  it("attempts to submit the cancellation request when 'Confirm Cancellation' is clicked", () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { cancelSubscriptionButton, getState, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    cancelSubscriptionButton.click()
    expect(axiosMock.post).toHaveBeenCalledWith('/app/user/' + getState().user.id + '/subscription/cancel/monthly', { password: testPassword })
  })

  it("displays an error message when the user has submitted an incorrect password", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } })
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    expect(passwordInput.placeholder).not.toEqual("Incorrect Password")
    expect(passwordInput.placeholder).not.toHaveStyleRule("1px solid red")
    await act(async () => {
      cancelSubscriptionButton.click()
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(passwordInput.value).toEqual("")
    expect(passwordInput.placeholder).toEqual("Incorrect Password")
    expect(passwordInput).toHaveStyleRule("1px solid red")
  })

  it("displays a generic error message when the cancellation request returns an unknown error", async () => {
    (axiosMock.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } })
    const { cancelSubscriptionButton, passwordInput } = settingsUserSubscriptionMonthly('MONTHLY')
    const testPassword = "Test Password"
    cancelSubscriptionButton.click()
    fireEvent.change(passwordInput, { target: { value: testPassword } })
    expect(passwordInput.placeholder).not.toHaveStyleRule("1px solid red")
    await act(async () => {
      cancelSubscriptionButton.click()
      await flushPromises()
      jest.advanceTimersByTime(500)
    })
    expect(passwordInput.value).toEqual("")
    expect(passwordInput.placeholder).toEqual("Enter your password")
    expect(passwordInput).toHaveStyleRule("1px solid red")
  })

})
