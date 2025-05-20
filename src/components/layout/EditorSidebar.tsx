import Link from "next/link"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Crop, ImageDown, LayoutGrid, LineChart, Wand2 } from "lucide-react"

const menuItems = [
  {
    label: "Upload",
    icon: ImageDown,
    path: "/"
  },
  {
    label: "Basic Editing",
    icon: Crop,
    path: "/editor"
  },
  {
    label: "Histogram",
    icon: LineChart,
    path: "/histogram"
  },
  {
    label: "Filters",
    icon: Wand2,
    path: "/filters"
  },
  {
    label: "Noise & FFT",
    icon: LayoutGrid,
    path: "/noise"
  }
]

export const EditorSidebar = () => {
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton asChild>
            <Link href={item.path}>
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
