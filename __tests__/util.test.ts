import {shouldConvertToDraft} from '../src/util'
import {expect, test} from '@jest/globals'
import {countReset} from 'console'

test('should allow convert to draft', async () => {
  const now = new Date()
  now.setDate(now.getDate() - 2)
  console.log(now.toISOString())
  expect(shouldConvertToDraft(now.toISOString(), 1)).toBeTruthy()
})

test('should not allow convert to draft', async () => {
  const now = new Date()
  expect(shouldConvertToDraft(now.toISOString(), 1)).toBeFalsy()
})
