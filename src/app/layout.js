import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tic Tac Toe",
  description: "Advocate Coding Challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <body className={inter.className}>
          {children}
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
