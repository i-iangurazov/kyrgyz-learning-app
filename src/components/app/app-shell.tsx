"use client";

import type { ReactNode } from "react";

import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { TopHeader } from "@/components/app/top-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-background shadow-app">
      <TopHeader />
      <main className="min-h-[calc(100vh-76px)] px-5 pb-28 pt-5">{children}</main>
      <BottomTabBar />
    </div>
  );
}
