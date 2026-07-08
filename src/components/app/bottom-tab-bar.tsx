"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Dumbbell, Gamepad2, Home, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "Главная", href: "/", icon: Home },
  { label: "Учиться", href: "/learn", icon: BookOpen },
  { label: "Практика", href: "/practice", icon: Dumbbell },
  { label: "Игры", href: "/games", icon: Gamepad2 },
  { label: "Профиль", href: "/profile", icon: UserRound },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 rounded-full border border-white/70 bg-[#101714]/92 px-2 py-2 shadow-island backdrop-blur-xl"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-medium text-white/62 transition",
                isActive && "bg-white text-[#101714] shadow-sm",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
