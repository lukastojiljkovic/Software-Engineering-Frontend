// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Radix Dialog za kreiranje ili uredjivanje cenovnog alarma na hartiji.
// Predvidjeno za ugradnju u SecuritiesDetailsPage i PriceAlertsPage.
//
// IMPLEMENTIRATI:
//   Props interfejs PriceAlertDialogProps:
//     listingId: number           — ID hartije za koju se kreira alarm
//     ticker: string              — za naslov dialoga (npr. "Alarm za AAPL")
//     currentPrice: number | null — prikazuje se kao referentna vrednost ispod
//                                   polja za prag; null = "cena nije dostupna"
//     currency: string            — valuta praga (npr. "USD")
//     existingAlert?: PriceAlertDto  — ako je prosledjeno, dialog radi u EDIT modu;
//                                      polja su popunjena vrednostima alerta
//     open: boolean
//     onOpenChange: (open: boolean) => void
//     onSuccess?: (alert: PriceAlertDto) => void  — callback posle uspesnog create/update
//
//   Forma (react-hook-form + zod):
//     condition: 'ABOVE' | 'BELOW'   — RadioGroup sa labelama iz PRICE_ALERT_CONDITION_LABELS
//     threshold: number               — number input, min > 0, max razumna granica (9_999_999)
//     note?: string                   — opcioni textarea, max 200 znakova
//
//   Zod schema validacija:
//     threshold: z.number().positive('Prag mora biti pozitivan broj')
//     condition: z.enum(['ABOVE', 'BELOW'])
//     note: z.string().max(200).optional()
//
//   Helper ispod threshold input-a:
//     Ako je currentPrice dostupan i condition je ABOVE:
//       "+X.XX% iznad trenutne cene" (zeleno ako threshold > currentPrice, crveno ako < currentPrice)
//     Ako je condition BELOW:
//       "-X.XX% ispod trenutne cene"
//     Azurirati pomocni tekst u realnom vremenu (watch threshold + condition).
//
//   Submit:
//     CREATE mod: priceAlertService.create({ listingId, condition, threshold, note })
//     EDIT mod: priceAlertService.update(existingAlert.id, { condition, threshold, note })
//     Posle uspesnog poziva: toast.success + onSuccess(alert) + onOpenChange(false).
//     Greska BE 400: prikazati u form error-u ispod threshold-a.
//
//   data-testid: 'price-alert-dialog', 'alert-condition-above', 'alert-condition-below',
//     'alert-threshold-input', 'alert-note-input', 'alert-submit-btn'.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import * as Dialog from '@radix-ui/react-dialog';

interface PriceAlertDialogProps {
  listingId: number;
  ticker: string;
  currentPrice: number | null;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PriceAlertDialog({
  ticker,
  open,
  onOpenChange,
  listingId,
  currentPrice,
  currency,
}: PriceAlertDialogProps) {
  void listingId;
  void currentPrice;
  void currency;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-xl p-6 w-full max-w-md"
          data-testid="price-alert-dialog"
        >
          <Dialog.Title className="text-lg font-semibold mb-4">
            Alarm za {ticker}
          </Dialog.Title>
          <p className="text-sm text-muted-foreground">Implementacija u toku — videti TODO blok iznad.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
