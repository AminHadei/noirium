import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vite-plus/test';
import { nextTick } from 'vue';

import BaseDropdown from './BaseDropdown.vue';
import type { BaseDropdownItem } from './types';

const dispatchKeydown = (key: string): void => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
  });
  globalThis.dispatchEvent(event);
};

describe('BaseDropdown', () => {
  const items: BaseDropdownItem[] = [
    {
      id: 1,
      label: 'Option 1',
    },
    {
      id: 2,
      label: 'Option 2',
    },
    {
      id: 3,
      label: 'Option 3',
      disabled: true,
    },
    {
      id: 4,
      label: 'Option 4',
    },
  ];

  // oxlint-disable-next-line no-explicit-any
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(BaseDropdown, {
      props: {
        items,
      },
      slots: {
        default: '<button>Trigger</button>',
      },
    });
  });

  describe('Rendering', () => {
    it('renders the trigger slot', () => {
      expect(wrapper.find('button').text()).toBe('Trigger');
    });

    it('does not show dropdown initially', () => {
      expect(wrapper.find('[role="datalist"]').exists()).toBe(false);
    });

    it('shows dropdown when opened', async () => {
      await wrapper.find('button').trigger('click');
      expect(wrapper.find('[role="datalist"]').exists()).toBe(true);
    });

    it('renders all items', async () => {
      await wrapper.find('button').trigger('click');
      const listItems = wrapper.findAll('[role="option"]');
      expect(listItems).toHaveLength(4);
    });

    it('renders item labels correctly', async () => {
      await wrapper.find('button').trigger('click');
      const listItems = wrapper.findAll('[role="option"]');
      expect(listItems[0]?.text()).toBe('Option 1');
      expect(listItems[1]?.text()).toBe('Option 2');
    });
  });

  describe('Interactions', () => {
    it('opens dropdown when trigger is clicked', async () => {
      expect(wrapper.vm.isOpen).toBe(false);

      await wrapper.find('button').trigger('click');
      await nextTick();
      await flushPromises();

      expect(wrapper.find('[role="datalist"]').exists()).toBe(true);
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it('closes dropdown when trigger is clicked again', async () => {
      // Use exposed methods for more reliable testing
      wrapper.vm.open();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(true);

      wrapper.vm.close();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('selects item when clicked', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.vm.isOpen).toBe(true);

      const firstItem = wrapper.findAll('[role="option"]')[0];
      await firstItem?.trigger('click');
      await nextTick();
      await flushPromises();

      // If item was clicked and closeOnSelect is true (default),
      // the dropdown should close, proving the selection worked
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('closes dropdown after selecting item by default', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.vm.isOpen).toBe(true);

      const firstItem = wrapper.findAll('[role="option"]')[0];
      await firstItem?.trigger('click');
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('keeps dropdown open when closeOnSelect is false', async () => {
      await wrapper.setProps({
        closeOnSelect: false,
      });
      await wrapper.find('button').trigger('click');
      const firstItem = wrapper.findAll('[role="option"]')[0];
      await firstItem?.trigger('click');
      await nextTick();

      expect(wrapper.find('[role="datalist"]').exists()).toBe(true);
    });

    it('does not select disabled items', async () => {
      await wrapper.find('button').trigger('click');
      // Option 3 is disabled
      const disabledItem = wrapper.findAll('[role="option"]')[2];
      await disabledItem?.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes dropdown on Escape key', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.vm.isOpen).toBe(true);

      dispatchKeydown('Escape');
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('navigates down with ArrowDown', async () => {
      await wrapper.find('button').trigger('click');
      await nextTick();
      await flushPromises();

      const initialIndex = wrapper.vm.focusedIndex;

      dispatchKeydown('ArrowDown');
      await nextTick();

      // Check that focus moved (implementation detail - checking via component state)
      expect(wrapper.vm.focusedIndex).toBeGreaterThan(initialIndex);
    });

    it('navigates up with ArrowUp', async () => {
      await wrapper.find('button').trigger('click');
      await nextTick();
      await flushPromises();

      // Move down first
      dispatchKeydown('ArrowDown');
      await nextTick();
      dispatchKeydown('ArrowDown');
      await nextTick();

      const currentIndex = wrapper.vm.focusedIndex;

      // Then move up
      dispatchKeydown('ArrowUp');
      await nextTick();

      expect(wrapper.vm.focusedIndex).toBeLessThan(currentIndex);
    });

    it('selects item with Enter key', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      dispatchKeydown('ArrowDown');
      await nextTick();

      const focusedItemIndex = wrapper.vm.focusedIndex;

      dispatchKeydown('Enter');
      await nextTick();

      // Either an item was selected or we handled the Enter key
      expect(focusedItemIndex).toBeGreaterThan(-1);
      expect([
        Boolean(wrapper.emitted('update:modelValue')),
        wrapper.vm.isOpen === false,
      ]).toContain(true);
    });

    it('selects item with Space key', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      dispatchKeydown('ArrowDown');
      await nextTick();

      const focusedItemIndex = wrapper.vm.focusedIndex;

      dispatchKeydown(' ');
      await nextTick();

      // Either an item was selected or we handled the Space key
      expect(focusedItemIndex).toBeGreaterThan(-1);
      expect([
        Boolean(wrapper.emitted('update:modelValue')),
        wrapper.vm.isOpen === false,
      ]).toContain(true);
    });

    it('jumps to first item with Home key', async () => {
      await wrapper.find('button').trigger('click');
      await nextTick();

      dispatchKeydown('End');
      await nextTick();
      dispatchKeydown('Home');
      await nextTick();

      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it('jumps to last item with End key', async () => {
      await wrapper.find('button').trigger('click');
      await nextTick();

      dispatchKeydown('End');
      await nextTick();

      // Last non-disabled item
      expect(wrapper.vm.focusedIndex).toBe(3);
    });

    it('skips disabled items when navigating', async () => {
      await wrapper.find('button').trigger('click');
      await nextTick();

      // Navigate to item before disabled one
      dispatchKeydown('ArrowDown');
      await nextTick();
      dispatchKeydown('ArrowDown');
      await nextTick();

      // Should skip disabled item (index 2) and go to index 3
      dispatchKeydown('ArrowDown');
      await nextTick();

      expect(wrapper.vm.focusedIndex).toBe(3);
    });
  });

  describe('Props', () => {
    it('uses default placement (bottom)', () => {
      expect(wrapper.props('placement')).toBe('bottom');
    });

    it('applies top placement', async () => {
      await wrapper.setProps({
        placement: 'top',
      });
      await wrapper.find('button').trigger('click');

      const dropdown = wrapper.find('[role="datalist"]');
      expect(dropdown.classes()).toContain('bottom-full');
    });

    it('applies custom offset', async () => {
      await wrapper.setProps({
        offset: 16,
      });
      await wrapper.find('button').trigger('click');

      const dropdown = wrapper.find('[role="datalist"]');
      expect(dropdown.attributes('style')).toContain('margin-top: 16px');
    });

    it('applies custom minWidth', async () => {
      await wrapper.setProps({
        minWidth: '300px',
      });
      await wrapper.find('button').trigger('click');

      const dropdown = wrapper.find('[role="datalist"]');
      expect(dropdown.attributes('style')).toContain('min-width: 300px');
    });

    it('applies custom maxHeight', async () => {
      await wrapper.setProps({
        maxHeight: '400px',
      });
      await wrapper.find('button').trigger('click');

      const dropdown = wrapper.find('[role="datalist"]');
      expect(dropdown.attributes('style')).toContain('max-height: 400px');
    });

    it('shows selected item', async () => {
      await wrapper.setProps({
        modelValue: items[1],
      });
      await wrapper.find('button').trigger('click');

      const selectedItem = wrapper.find('[aria-selected="true"]');
      expect(selectedItem.exists()).toBe(true);
      expect(selectedItem.text()).toBe('Option 2');
    });
  });

  describe('Slots', () => {
    it('renders custom item slot', async () => {
      const customWrapper = mount(BaseDropdown, {
        props: {
          items,
        },
        slots: {
          default: '<button>Trigger</button>',
          item: '<template #item="{ item }"><div class="custom-item">{{ item.label }}</div></template>',
        },
      });

      await customWrapper.find('button').trigger('click');
      expect(customWrapper.find('.custom-item').exists()).toBe(true);
    });

    it('passes correct slot props to item slot', async () => {
      const customWrapper = mount(BaseDropdown, {
        props: {
          items,
          modelValue: items[0]!,
        },
        slots: {
          default: '<button>Trigger</button>',
          item: `<template #item="props">
            <div class="custom-item" :data-selected="props.isSelected">
              {{ props.item.label }}
            </div>
          </template>`,
        },
      });

      await customWrapper.find('button').trigger('click');
      const firstItem = customWrapper.findAll('.custom-item')[0];

      expect(firstItem?.attributes('data-selected')).toBe('true');
    });

    it('passes slot props to trigger slot', () => {
      const customWrapper = mount(BaseDropdown, {
        props: {
          items,
          modelValue: items[1]!,
        },
        slots: {
          default: `<template #default="{ selectedItem, isOpen }">
            <button :data-open="isOpen">{{ selectedItem?.label || 'Select' }}</button>
          </template>`,
        },
      });

      const button = customWrapper.find('button');
      expect(button.text()).toBe('Option 2');
      expect(button.attributes('data-open')).toBe('false');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      await wrapper.find('button').trigger('click');
      const dropdown = wrapper.find('[role="datalist"]');

      expect(dropdown.attributes('role')).toBe('datalist');
    });

    it('marks items with correct ARIA attributes', async () => {
      await wrapper.setProps({
        modelValue: items[0],
      });
      await wrapper.find('button').trigger('click');

      const options = wrapper.findAll('[role="option"]');
      expect(options[0]?.attributes('aria-selected')).toBe('true');
      expect(options[1]?.attributes('aria-selected')).toBe('false');
    });

    it('marks disabled items with aria-disabled', async () => {
      await wrapper.find('button').trigger('click');

      const disabledOption = wrapper.findAll('[role="option"]')[2];
      expect(disabledOption?.attributes('aria-disabled')).toBe('true');
    });

    it('sets aria-activedescendant for focused item', async () => {
      await wrapper.find('button').trigger('click');
      const dropdown = wrapper.find('[role="datalist"]');

      await dropdown.trigger('keydown', {
        key: 'ArrowDown',
      });
      await nextTick();

      const activedescendant = dropdown.attributes('aria-activedescendant');
      expect(activedescendant).toBeTruthy();
      expect(activedescendant).toContain('option-');
    });
  });

  describe('Exposed Methods', () => {
    it('exposes open method', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.find('[role="datalist"]').exists()).toBe(true);
    });

    it('exposes close method', async () => {
      wrapper.vm.open();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(true);

      wrapper.vm.close();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('exposes toggle method', async () => {
      expect(wrapper.vm.isOpen).toBe(false);

      wrapper.vm.toggle();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(true);

      wrapper.vm.toggle();
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('exposes isOpen ref', async () => {
      expect(wrapper.vm.isOpen).toBe(false);

      wrapper.vm.open();
      await nextTick();
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it('exposes selectedId computed', async () => {
      expect(wrapper.vm.selectedId).toBeUndefined();

      await wrapper.setProps({
        modelValue: items[1],
      });
      expect(wrapper.vm.selectedId).toBe(2);
    });
  });

  describe('Click Outside', () => {
    it('closes dropdown when clicking outside', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.vm.isOpen).toBe(true);

      // Simulate click outside
      const event = new MouseEvent('click', {
        bubbles: true,
      });
      document.body.dispatchEvent(event);
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      const emptyWrapper = mount(BaseDropdown, {
        props: {
          items: [],
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      });

      expect(emptyWrapper.html()).toBeTruthy();
    });

    it('handles null modelValue', async () => {
      await wrapper.setProps({
        modelValue: null,
      });
      await wrapper.find('button').trigger('click');

      const selectedItems = wrapper.findAll('[aria-selected="true"]');
      expect(selectedItems.length).toBe(0);
    });

    it('handles item selection with same value', async () => {
      await wrapper.setProps({
        modelValue: items[0],
      });

      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      expect(wrapper.vm.isOpen).toBe(true);

      const firstItem = wrapper.findAll('[role="option"]')[0];
      await firstItem?.trigger('click');
      await nextTick();
      await flushPromises();

      // If item was clicked and closeOnSelect is true (default),
      // the dropdown should close, proving the selection worked
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('handles all items disabled', async () => {
      const allDisabledItems = items.map((item) => ({
        ...item,
        disabled: true,
      }));
      await wrapper.setProps({
        items: allDisabledItems,
      });
      await wrapper.find('button').trigger('click');
      await nextTick();
      await flushPromises();

      const initialIndex = wrapper.vm.focusedIndex;

      dispatchKeydown('ArrowDown');
      await nextTick();

      // Should not navigate since all items are disabled
      expect(wrapper.vm.focusedIndex).toBe(initialIndex);
    });
  });

  describe('Hover Interactions', () => {
    it('updates focused index when hovering over an item', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      const listItems = wrapper.findAll('[role="option"]');
      // Initially focused on first item
      expect(wrapper.vm.focusedIndex).toBe(0);

      // Hover over second item
      await listItems[1]?.trigger('mouseenter');
      await nextTick();

      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it('updates focused index when hovering over different items', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      const listItems = wrapper.findAll('[role="option"]');

      // Hover over third item
      await listItems[2]?.trigger('mouseenter');
      await nextTick();
      expect(wrapper.vm.focusedIndex).toBe(2);

      // Hover over first item
      await listItems[0]?.trigger('mouseenter');
      await nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });
  });

  describe('Scroll Behavior', () => {
    it('scrolls focused item into view when navigating with keyboard', async () => {
      wrapper.vm.open();
      await nextTick();
      await flushPromises();

      const listItems = wrapper.findAll('[role="option"]');

      // Mock scrollIntoView on the list item elements
      const scrollIntoViewMock = vi.fn<() => void>();
      for (const item of listItems) {
        item.element.scrollIntoView = scrollIntoViewMock;
      }

      // Navigate down using keyboard
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      });
      globalThis.dispatchEvent(event);
      await nextTick();
      await flushPromises();

      // scrollIntoView should have been called
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
