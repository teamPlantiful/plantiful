import QueryProvider from '@/providers/queryProvider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
