import ReactThreeTestRenderer from '@react-three/test-renderer'

import Box from './box'

describe('Box', () => {
  it('scales on click', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Box />)

    const mesh = renderer.scene.children[0]
    await renderer.fireEvent(mesh, 'click')

    expect(mesh.props.scale).toBe(1.5)
  })
})
