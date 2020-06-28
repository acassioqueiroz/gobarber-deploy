import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    }),
  };
});

describe('SignIn page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });
  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(ButtonElement);
    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid e-mail', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'email-not-valid' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(ButtonElement);
    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to sign when occour an error', async () => {
    jest.mock('../../hooks/Auth', () => {
      return {
        useAuth: () => ({
          signIn: () => {
            throw new Error();
          },
        }),
      };
    });

    const mockedAddToast = jest.fn();

    jest.mock('../../hooks/Toast', () => {
      return {
        useToast: () => ({
          addToast: mockedAddToast,
        }),
      };
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@exemple.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(ButtonElement);
    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });
});
