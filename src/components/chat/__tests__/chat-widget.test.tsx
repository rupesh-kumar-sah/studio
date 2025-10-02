import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWidget } from '../chat-widget';
import { useAuth } from '@/components/auth/auth-provider';

jest.mock('@/components/auth/auth-provider');

describe('ChatWidget', () => {
  const mockCurrentUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    avatar: '',
    password: 'password',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      owner: { id: '1', avatar: '' },
      isOwner: false,
      isMounted: true,
    });
    localStorage.clear();
  });

  it('renders chat button when closed', () => {
    render(<ChatWidget />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens chat on button click', () => {
    render(<ChatWidget />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });

  it('sends a message and clears input', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input);
    expect(input).toHaveValue('');
  });
});
