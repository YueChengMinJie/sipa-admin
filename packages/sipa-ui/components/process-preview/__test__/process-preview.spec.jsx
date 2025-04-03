import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defaultPrefix } from '@sipa-ui/core/utils/config';
import ProcessView from '../process-preview.vue';

describe('process-preview test', () => {
  it('create default button', () => {
    const wrapper = mount(ProcessView);
    expect(wrapper.classes()).toContain(`${defaultPrefix}-process-preview`);
  });
});
