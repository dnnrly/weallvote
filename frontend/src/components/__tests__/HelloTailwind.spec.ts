import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloTailwind from '../HelloTailwind.vue'

describe('HelloTailwind', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloTailwind)
    expect(wrapper.text()).toContain('Vue + Tailwind 4')
  })
})
