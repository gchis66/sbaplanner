import "./globals.css";
import Favicon from "./components/Favicon";

export const metadata = {
  title: "SBA Planner - Generate Business Plans in Minutes",
  description:
    "Create SBA-ready business plans instantly using our AI-powered platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Favicon />
      </head>
      <body>{children}</body>
    </html>
  );
}
