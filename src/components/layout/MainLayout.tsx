import { Outlet } from 'react-router-dom';
import ClientSidebar from '../shared/ClientSidebar';
import RouteErrorBoundary from '../shared/RouteErrorBoundary';

/*
 * TODO [FE1 - Zaglavlje aplikacije | Developer: Marta Suljagic]
 *
 * Montirati novu komponentu <Header /> (src/components/layout/Header.tsx)
 * iznad sadrzaja aplikacije. Komponenta treba da sadrzi:
 *   - Zvono za notifikacije sa badge brojacem neprocitanih (navigira na /notifications)
 *   - (Opciono) brza pretraga, korisnicko ime, trenutna rola
 *
 * Implementacioni koraci:
 *   1. Kreirati src/components/layout/Header.tsx
 *   2. Uvesti i renderovati <Header /> u ovom fajlu, iznad <ClientSidebar />
 *      ili kao prvi element unutar <> fragmenta.
 *   3. Dodati gornji padding na <main> element (npr. pt-14 ili pt-16) kako
 *      sadrzaj ne bi bio prekriven fiksnim zaglavljem (position: fixed / sticky).
 *   4. Uskladiti z-index zaglavlja sa bočnom trakom (sidebar ima z-50 na mobilnom).
 *
 * Trenutna struktura za referencu:
 *   <ClientSidebar />
 *   <main className="md:ml-64 min-h-screen bg-muted/40">
 *     <div className="max-w-screen-2xl px-6 sm:px-8 lg:px-12 py-6">
 *       ...
 *     </div>
 *   </main>
 */
export default function MainLayout() {
  return (
    <>
      <ClientSidebar />
      <main className="md:ml-64 min-h-screen bg-muted/40">
        {/*
          Tailwind 4 ne pruza default `container` utility kao TW3.
          max-w-screen-2xl (1536px) daje vise horizontalnog prostora ali
          zadrzava lufta sa strane preko px-* utility-ja. NE koristimo
          mx-auto kombinaciju jer to centrira ispod 1536px viewport-a;
          ovde hocemo da content popuni dostupnu sirinu.
        */}
        <div className="max-w-screen-2xl px-6 sm:px-8 lg:px-12 py-6">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </main>
    </>
  );
}
