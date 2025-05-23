import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";
import { Separator } from "@/components/ui/separator";

import { SidebarContent, Sidebar } from "@/components/ui/sidebar";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection/>
        <Separator/>
        <PersonalSection/>
      </SidebarContent>
    </Sidebar>
  )
}
