/**
 * The wordmark is shown on nine screens. These tests keep it a single
 * component, so the lettering and the attached orange full stop cannot drift
 * apart again (it had become a spaced " ." on the login pages).
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Logo from './Logo';

const renderLogo = (props) =>
  render(
    <MemoryRouter>
      <Logo {...props} />
    </MemoryRouter>
  );

describe('Logo', () => {
  it('writes SweetNest with the full stop attached, in the accent colour', () => {
    const { container } = renderLogo();
    const mark = container.firstChild;

    expect(mark.textContent).toBe('SweetNest.');
    expect(mark.querySelector('span').className).toContain('text-accent');
  });

  it('links to the home page when asked to', () => {
    renderLogo({ linked: true });

    expect(screen.getByRole('link', { name: 'SweetNest home' }).getAttribute('href')).toBe('/');
  });

  it('is plain text by default', () => {
    renderLogo();

    expect(screen.queryByRole('link')).toBeNull();
  });
});
