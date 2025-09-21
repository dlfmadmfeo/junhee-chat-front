export default function CafeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="p-6">{children}</div>;
}
