
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu, X, BarChart2, Globe, FileText, TrendingUp, HelpCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar when changing routes on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home, current: location.pathname === "/app" },
    { name: "Currency Exchange", href: "/app/currency", icon: Globe, current: location.pathname === "/app/currency" },
    { name: "Register Business", href: "/app/register", icon: FileText, current: location.pathname === "/app/register" },
    { name: "Business Analytics", href: "/app/analytics", icon: BarChart2, current: location.pathname === "/app/analytics" },
    { name: "Business Advice", href: "/app/advice", icon: HelpCircle, current: location.pathname === "/app/advice" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center gap-x-6 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Business Vista Advisor
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="fixed inset-y-0 left-0 z-40 w-full overflow-y-auto bg-sidebar px-4 pb-6 sm:max-w-xs sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-business-teal" />
              <span className="text-xl font-bold text-white">BizVista</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-sidebar-accent"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          
          <nav className="flex flex-1 flex-col mt-5 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  item.current
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
          <div className="flex items-center h-16 pt-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-business-teal" />
              <span className="text-xl font-bold text-white">BizVista</span>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col mt-5">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          item.current
                            ? "bg-sidebar-accent text-white"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
