import './globals.css';

export const metadata = {
  title: 'Injury Recovery',
  description: 'Evidence-driven injury recovery planning and progress tracking.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
