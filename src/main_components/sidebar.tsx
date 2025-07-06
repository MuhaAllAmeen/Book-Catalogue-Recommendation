import { Home, ChartBarIncreasing , Search, Settings, Library, PersonStandingIcon, BotIcon, LockIcon, StarIcon, MenuIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth_context"
import { responseHandler } from "@/lib/utils"
import {logout as apiLogout} from "../request/auth"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Catalogue",
    url: "/catalogue",
    icon: Library,
  },
  {
    title: "Recommendations",
    url: "/recommendations",
    icon: StarIcon,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: ChartBarIncreasing,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const authItems = [
    {
        title: "Login",
        url: "/login",
        icon: PersonStandingIcon
    },
    {
        title: "Register",
        url: "/register",
        icon: BotIcon
    }
]



export default function AppSidebar() {
    const {user,logout} = useAuth()

    function onLogoutClicked(){
        responseHandler(()=>apiLogout(),()=>{
            logout()
        },()=>{})
    }

  return (
    <Sidebar className="bg-amber-200">
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
                <SidebarMenu className="h-full">
                    <div className="">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title} className="font-bold text-xl">
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        
                    </div>
                
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            {/* show login and register if logged out else show logout button */}
            {user==null && authItems.map((item)=>(
                <SidebarMenuItem key={item.title} className="font-bold text-xl">
                <SidebarMenuButton asChild>
                    <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                    </a>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            {user!=null && (
                <SidebarMenuItem key={"Logout"} className="font-bold text-xl">
                <SidebarMenuButton onClick={onLogoutClicked}>
                    <LockIcon />
                    <span>{"Logout"}</span>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )}
        </SidebarMenu>
                            
    </SidebarFooter>
    </Sidebar>
  )
}

//custom sidebar button
export function SidebarTriggerButton() {
    const { toggleSidebar } = useSidebar()
 
    return <button className="" onClick={toggleSidebar}>
        <MenuIcon size={40} />
    </button>
}
