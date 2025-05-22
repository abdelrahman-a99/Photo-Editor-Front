import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { EditorSidebar } from "./EditorSidebar"

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800">
      <SidebarHeader className="text-lg font-bold text-gray-900 dark:text-gray-100">
        Image Editor
      </SidebarHeader>
      <SidebarContent>
        <EditorSidebar />
      </SidebarContent>
      <SidebarFooter className="text-xs text-gray-500 dark:text-gray-400">
        Smart Photo Editor v1.0
      </SidebarFooter>
    </Sidebar>
  )
}
