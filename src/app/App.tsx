import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './providers'
import { AppShell } from '@/components/layout/AppShell'
import { routes } from './routes'
import { Skeleton } from '@/components/ui/skeleton'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell>
          <Suspense
            fallback={
              <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </div>
            }
          >
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
