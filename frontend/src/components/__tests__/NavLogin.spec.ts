// tests/components/NavLogin.spec.ts
import { render, fireEvent } from '@testing-library/vue';
import NavLogin from '@/components/NavLogin.vue';
import { describe, it, expect } from 'vitest';

describe('NavLogin.vue', () => {
  it('renders Login button initially', () => {
    const { getByText } = render(NavLogin);
    expect(getByText('Login')).toBeTruthy();
  });

  it('opens modal when login is clicked', async () => {
    const { getByText, findByText } = render(NavLogin);
    await fireEvent.click(getByText('Login'));
    expect(await findByText('Login')).toBeTruthy(); // modal opens
  });
});
