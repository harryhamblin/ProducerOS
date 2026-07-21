import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Bids",
    href: "/bids",
    icon: Briefcase,
  },
  {
    name: "Crew",
    href: "/crew",
    icon: Users,
  },
  {
    name: "Bookings",
    href: "/bookings",
    icon: Calendar,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">
          ProducerOS
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Production Management
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icon size={18} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}