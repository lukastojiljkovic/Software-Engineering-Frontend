import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SavingsCalculator } from '../components/savings/SavingsCalculator';

describe('SavingsCalculator', () => {
  it('shows monthly interest for RSD 4% 200K', () => {
    render(
      <SavingsCalculator
        principal={200000}
        annualRate={4}
        termMonths={12}
        currencyCode="RSD"
      />
    );
    // 200000 * 4 / 1200 = 666.67
    const monthly = screen.getByTestId('calc-monthly');
    expect(monthly.textContent).toMatch(/666/);
  });

  it('shows total interest over 12 months', () => {
    render(
      <SavingsCalculator
        principal={200000}
        annualRate={4}
        termMonths={12}
        currencyCode="RSD"
      />
    );
    // 666.67 * 12 = ~8000
    const total = screen.getByTestId('calc-total');
    expect(total.textContent).toMatch(/8\.000|8,000|8000|8\.000,00/);
  });

  it('shows penalty as 1% of principal', () => {
    render(
      <SavingsCalculator
        principal={100000}
        annualRate={4}
        termMonths={12}
        currencyCode="RSD"
      />
    );
    // 100000 * 0.01 = 1000
    const penalty = screen.getByTestId('calc-penalty');
    expect(penalty.textContent).toMatch(/1\.000|1,000|1000/);
  });

  it('handles zero principal gracefully', () => {
    render(
      <SavingsCalculator
        principal={0}
        annualRate={0}
        termMonths={12}
        currencyCode="EUR"
      />
    );
    expect(screen.getByTestId('calc-monthly').textContent).toMatch(/0/);
  });
});
