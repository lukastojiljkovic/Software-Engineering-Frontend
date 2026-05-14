/**
 * Plan v3.6 §Task 7 — vitest za ArbitroPreviewCard friendly preview komponentu.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArbitroPreviewCard } from './ArbitroPreviewCard';

describe('ArbitroPreviewCard', () => {
  it('renderuje summary + label za poznat tool', () => {
    render(
      <ArbitroPreviewCard
        toolName="create_payment"
        summary="Inter-bank transfer 100 RSD"
        fields={[]}
      />,
    );
    // Summary kao tekst
    expect(screen.getByText('Inter-bank transfer 100 RSD')).toBeInTheDocument();
    // Label za create_payment je "Plaćanje" — uveden iz TOOL_LABELS mape
    expect(screen.getByText(/Pla.anje/i)).toBeInTheDocument();
  });

  it('renderuje fields sa odgovarajucim emphasis-om', () => {
    render(
      <ArbitroPreviewCard
        toolName="create_payment"
        summary="Plati"
        fields={[
          { label: 'Sa racuna', value: '222000***0010', emphasis: 'account' },
          { label: 'Primalac', value: 'Milica Nikolic', emphasis: 'name' },
          { label: 'Iznos', value: '100.00 RSD', emphasis: 'amount' },
          { label: 'Svrha', value: 'Rodj' },
        ]}
      />,
    );
    expect(screen.getByText('Sa racuna')).toBeInTheDocument();
    expect(screen.getByText('222000***0010')).toBeInTheDocument();
    expect(screen.getByText('Primalac')).toBeInTheDocument();
    expect(screen.getByText('Milica Nikolic')).toBeInTheDocument();
    expect(screen.getByText('Iznos')).toBeInTheDocument();
    expect(screen.getByText('100.00 RSD')).toBeInTheDocument();
    expect(screen.getByText('Svrha')).toBeInTheDocument();
    expect(screen.getByText('Rodj')).toBeInTheDocument();
  });

  it('renderuje warnings u amber alert-u kad postoje', () => {
    render(
      <ArbitroPreviewCard
        toolName="create_payment"
        summary="Inter-bank placanje"
        fields={[]}
        warnings={['Inter-bank placanje (drugi prefix racuna).', '2PC commit moze potrajati.']}
      />,
    );
    const warningsBlock = screen.getByTestId('arbitro-preview-warnings');
    expect(warningsBlock).toBeInTheDocument();
    expect(warningsBlock).toHaveTextContent('Inter-bank placanje');
    expect(warningsBlock).toHaveTextContent('2PC commit');
  });

  it('NE prikazuje warnings sekciju kad je niz prazan ili undefined', () => {
    const { rerender } = render(
      <ArbitroPreviewCard toolName="create_payment" summary="Test" fields={[]} />,
    );
    expect(screen.queryByTestId('arbitro-preview-warnings')).not.toBeInTheDocument();

    rerender(
      <ArbitroPreviewCard toolName="create_payment" summary="Test" fields={[]} warnings={[]} />,
    );
    expect(screen.queryByTestId('arbitro-preview-warnings')).not.toBeInTheDocument();
  });

  it('koristi fallback ikonu + tool name labelu za nepoznat tool', () => {
    render(
      <ArbitroPreviewCard
        toolName="some_unknown_tool"
        summary="Nepoznata akcija"
        fields={[]}
      />,
    );
    expect(screen.getByText('Nepoznata akcija')).toBeInTheDocument();
    // Label fallback — koristi sirov tool name
    expect(screen.getByText('some_unknown_tool')).toBeInTheDocument();
  });
});
