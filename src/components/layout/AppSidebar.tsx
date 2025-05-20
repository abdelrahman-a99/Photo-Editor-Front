import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { EditorSidebar } from "./EditorSidebar"

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="text-lg font-bold">
        Image Editor
      </SidebarHeader>
      <SidebarContent>
        <EditorSidebar />
      </SidebarContent>
      <SidebarFooter className="text-xs text-muted-foreground">
        Smart Photo Editor v1.0
      </SidebarFooter>
    </Sidebar>
  )
}
