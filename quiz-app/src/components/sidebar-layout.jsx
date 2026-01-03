import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-slidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import Navbar from "@/component/navbar/navbar";

export default function SideBarLayout() {
  const navigate = useNavigate();

  const navbarConfig = {
    "/dashboard": {
      title: "Your Quizzes",
      showSearch: true,
      showAction: true,
      actionLabel: "Create New Quiz",
      onActionClick: () => navigate("/create-quiz"),
    },
    "/analytics": {
      title: "Analytics",
      showSearch: false,
      showAction: false,
    },
    "/profile": {
      title: "Your Profile",
      showSearch: false,
      showAction: false,
    },
    "/create-quiz": {
      title: "Create New Quiz",
      showSearch: false,
      showAction: false,
    },
    "/quiz": {
      title: "Edit Quiz",
      showSearch: false,
      showAction: false,
    },
  };

  const path = location.pathname;
  const config =
    navbarConfig[path] ||
    (path.startsWith("/quiz/")
      ? navbarConfig["/quiz"]
      : {
          title: "Quiz Master",
        });

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar
            title={config.title}
            showSearch={config.showSearch}
            showAction={config.showAction}
            actionLabel={config.actionLabel}
            onActionClick={config.onActionClick}
            leftSlot={<SidebarTrigger />}
          />
          <Separator />

          <div className="p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
