import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppSidebar from './components/AppSidebar.tsx'
import Navbar from './components/Navbar.tsx'
import { ThemeProvider } from './components/provider/ThemeProvider.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <main className='flex w-full'>
            <AppSidebar />
            <div className='flex flex-col w-full'>
              <Navbar />
              <App />
            </div>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
