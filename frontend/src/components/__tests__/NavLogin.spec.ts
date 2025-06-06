// tests/components/NavLogin.spec.ts
import { render, fireEvent, cleanup, waitFor } from '@testing-library/vue';
import NavLogin from '@/components/NavLogin.vue';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock Firebase auth
vi.mock('@/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null); // simulate logged out state
      }
      return vi.fn(); // return unsubscribe function
    }),
  },
}));

vi.mock('@firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: class MockGoogleAuthProvider {},
  onAuthStateChanged: vi.fn(),
}));

describe('NavLogin.vue', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders login button in the navigation bar initially', () => {
    const { getAllByTestId } = render(NavLogin);
    const navLoginButtons = getAllByTestId('nav-login-button');
    const navLoginButton = navLoginButtons[0];
    expect(navLoginButton).toBeTruthy();
    expect(navLoginButton.textContent?.trim()).toBe('Login');
  });

  it('opens modal when navigation login button is clicked', async () => {
    const { getAllByTestId, findByTestId } = render(NavLogin);
    
    const navLoginButtons = getAllByTestId('nav-login-button');
    await fireEvent.click(navLoginButtons[0]);
    
    const modalSubmitButton = await findByTestId('modal-submit-button');
    expect(modalSubmitButton).toBeTruthy();
    expect(modalSubmitButton.textContent?.trim()).toBe('Login');
  });

  // Split the toggle test into two separate tests for clarity
  it('switches from login to register mode', async () => {
    const { getAllByTestId, findByText, findByTestId } = render(NavLogin);
    
    // Open the modal
    await fireEvent.click(getAllByTestId('nav-login-button')[0]);
    
    // Initially in login mode
    const submitButton = await findByTestId('modal-submit-button');
    expect(submitButton.textContent?.trim()).toBe('Login');
    
    // Find and click the "Register" link
    const registerLink = await findByText('Register');
    await fireEvent.click(registerLink);
    
    // Now in register mode - wait for the button text to update
    await waitFor(() => {
      expect(submitButton.textContent?.trim()).toBe('Create Account');
    });
  });
  
  it('switches from register to login mode', async () => {
    const { getAllByTestId, findByText, findByTestId } = render(NavLogin);
    
    // Open the modal
    await fireEvent.click(getAllByTestId('nav-login-button')[0]);
    
    // Switch to register mode first
    const registerLink = await findByText('Register');
    await fireEvent.click(registerLink);
    
    // Verify we're in register mode
    const submitButton = await findByTestId('modal-submit-button');
    await waitFor(() => {
      expect(submitButton.textContent?.trim()).toBe('Create Account');
    });
    
    // Now find and click the "Login" link
    const loginLink = await findByText('Login', { selector: 'a.text-blue-600' });
    await fireEvent.click(loginLink);
    
    // Wait for the button text to update back to Login
    await waitFor(() => {
      expect(submitButton.textContent?.trim()).toBe('Login');
    }, { timeout: 2000 });
  });

  it('closes the modal when clicking the close button', async () => {
    const { getAllByTestId, findByTestId, queryByTestId } = render(NavLogin);
    
    await fireEvent.click(getAllByTestId('nav-login-button')[0]);
    expect(await findByTestId('modal-submit-button')).toBeTruthy();
    
    const closeButton = await findByTestId('modal-close-button');
    await fireEvent.click(closeButton);
    
    expect(queryByTestId('modal-submit-button')).toBeFalsy();
  });
});