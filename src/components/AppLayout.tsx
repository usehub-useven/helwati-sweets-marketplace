import { ReactNode } from "react";
import { DesktopNav } from "./DesktopNav";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  return (
    <div className="min-h-screen desktop-bg">
      {/* Desktop Navigation */}
      {showNav && <DesktopNav />}

      {/* Main Content Container */}
      <div className="md:pt-16 md:pb-8 md:px-4 lg:px-8">
        <div className="md:max-w-7xl md:mx-auto md:bg-background md:rounded-3xl md:shadow-elevated md:min-h-[calc(100vh-6rem)] md:overflow-hidden">
          {children}
        </div>
      </div>

      {/* Mobile Navigation */}
      {showNav && <BottomNav />}
    </div>
  );
};

export default AppLayout;
