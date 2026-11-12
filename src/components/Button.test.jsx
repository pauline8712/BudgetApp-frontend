import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('visar texten som skickas in', () => {
    render(<Button>Spara</Button>);

    const button = screen.getByRole('button', { name: 'Spara' });

    expect(button).toBeDefined();
  });

  it('anropar onClick när man klickar', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Spara</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Spara' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('går inte att klicka när den är disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Spara
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Spara' }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
