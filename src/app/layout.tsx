import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Author Prism | Academic & Strategic Writing Workspace",
  description: "AI-powered workspace for reflective essays, journals, SWOT analysis, and business strategy with Harvard referencing, MyBib, and multi-model Claude & Gemini support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
