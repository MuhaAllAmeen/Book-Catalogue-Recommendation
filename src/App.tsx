import { Outlet } from 'react-router'
import './App.css'
import { SidebarProvider } from './components/ui/sidebar'
import AppSidebar, { SidebarTriggerButton } from './main_components/sidebar'
import { AuthProvider } from './context/auth_context'
import { Toaster } from 'sonner'

function App() {
  return (

    // for getting user globally in any component
    <AuthProvider>
      <SidebarProvider defaultOpen>
        <main className="w-full">
          {/* for toast messages */}
          <Toaster />
          <div className='flex w-full'>
            <AppSidebar />
            <div className='lg:hidden md:hidden fixed bg-amber-200 flex w-full h-[50px] z-10 pl-4'>
              {/* <SidebarTrigger  /> */}
              <SidebarTriggerButton />
            </div>
            <div className='my-20 mx-9 flex-1 w-fit overflow-auto'>
              {/* all child components of react router (all pages) */}
              <Outlet />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
    
  )
}

export default App
