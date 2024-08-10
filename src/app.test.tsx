import { render, screen } from '@testing-library/react'

import App from './app'

describe('App', () => {
  it('renders correctly', () => {
    render(<App />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
