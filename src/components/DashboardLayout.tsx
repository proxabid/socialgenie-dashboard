import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, BarChart2, History, Calendar, MessageSquare, Lightbulb, Tags, Bell, Share2, User, Monitor, Smartphone, Type } from "lucide-react";
import { getTags } from "@/services/tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const tags = getTags();
  const { user } = useUser();

  const getTagIcon = (tagName: string) => {
    const lowerName = tagName.toLowerCase();
    if (lowerName.includes('web')) return <Monitor className="w-3 h-3" />;
    if (lowerName.includes('mobile')) return <Smartphone className="w-3 h-3" />;
    if (lowerName.includes('typography')) return <Type className="w-3 h-3" />;
    return <Tags className="w-3 h-3" />;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar className="border-r border-gray-100">
          <div className="flex items-center gap-2 p-4 border-b border-gray-100">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-lg">SocialGenie</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-gray-600 hover:bg-gray-50 rounded-lg">
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span>Generate Post</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 mr-3" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-gray-600 hover:bg-gray-50 rounded-lg">
                      <History className="w-4 h-4 mr-3" />
                      <span>History</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Lightbulb className="w-4 h-4 mr-3" />
                      <span>Ideas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-gray-600 hover:bg-gray-50 rounded-lg">
                      <BarChart2 className="w-4 h-4 mr-3" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase px-4">Tags</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-4 bg-gray-50 rounded-lg mx-4">
                  <div className="columns-2 gap-2 space-y-2 [&>*:first-child]:mt-0">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className={cn(
                          "inline-flex w-full break-inside-avoid mb-2 justify-start cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-full",
                          "bg-white text-gray-700 border border-gray-200",
                          "items-center gap-2 text-xs font-medium transition-all duration-200",
                          "group hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                        )}
                      >
                        {getTagIcon(tag.name)}
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder="Search..."
                className="bg-gray-50 border-none rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-8 h-8 p-1 bg-gray-100 rounded-full text-gray-600" />
              )}
            </div>
          </header>
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}