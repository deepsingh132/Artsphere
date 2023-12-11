import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { server } from './__mocks__/server'

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers())
afterAll(() => server.close())