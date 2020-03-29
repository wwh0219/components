import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import VirtualList from 'packages/virtual-list/src'
import 'jsdom-global'
describe('virtual-list.vue', () => {
  it('props.tag', () => {
    const msg = 'new message'
    const wrapper = mount(VirtualList, {
      propsData: {
        tag: 'ul'
      }
    })
    // expect(wrapper.element.querySelector('.virtual-list__main')?.tagName).eq('UL')
  })
})
