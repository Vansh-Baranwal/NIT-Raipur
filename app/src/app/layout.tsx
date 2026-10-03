import './globals.css';

export const metadata = {
  title: 'Utsava Terminal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body onContextMenu={(e) => e.preventDefault()} /* Disable native context menu */>
        {children}
      </body>
    </html>
  );
}
