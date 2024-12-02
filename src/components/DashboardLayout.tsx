import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, BarChart2, History, Calendar, MessageSquare, Lightbulb, Tags } from "lucide-react";
import { getTags } from "@/services/tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const tags = getTags();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F8F8F9]">
        <Sidebar className="border-r bg-white">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[#6B7280]">Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>Generate Post</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>View Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <History className="w-4 h-4 mr-2" />
                      <span>Analyze History</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      <span>Explore Ideas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <BarChart2 className="w-4 h-4 mr-2" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-[#374151] hover:bg-[#F3F4F6]">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  Tags
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-4 space-y-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className={cn("w-full justify-start cursor-pointer", tag.color)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[#6B7280]">Statistics</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-4 space-y-4">
                  <div className="bg-[#F3F4F6] rounded-lg p-3">
                    <p className="text-sm font-medium text-[#374151]">Posts Generated</p>
                    <p className="text-2xl font-bold text-[#111827]">128</p>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg p-3">
                    <p className="text-sm font-medium text-[#374151]">Success Rate</p>
                    <p className="text-2xl font-bold text-[#111827]">98%</p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
