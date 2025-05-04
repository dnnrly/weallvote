import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'

describe('HeroSection', () => {
  it('renders properly', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title and description', () => {
    const wrapper = mount(HeroSection)
    
    const title = wrapper.find('.hero-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Create polls. Get instant feedback. Make better decisions.')
    
    const description = wrapper.find('.hero-text')
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe('PollCraft lets you create and share simple polls in seconds. No account needed to vote.')
  })

  it('has a create poll button with correct text', () => {
    const wrapper = mount(HeroSection)
    
    const button = wrapper.find('.hero-button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('+ Create a New Poll')
  })

  it('has a sample polls link with correct text', () => {
    const wrapper = mount(HeroSection)
    
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('See sample polls')
    expect(link.attributes('href')).toBe('#')
  })
})