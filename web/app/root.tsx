import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
} from "@remix-run/react";
import type { MetaFunction, LinksFunction } from "@remix-run/cloudflare";
import "./tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },

    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Cryptid",
    },
    {
      name: "description",
      content: "This is my personal crypto portfolio website.",
    },
  ];
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="relative flex h-full flex-col bg-black text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
