import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function SideNav() {
  return (
    <aside className="flex h-full flex-col rounded-r-2xl bg-white shadow-lg border-r border-gray-200">
      <div
        className="mb-8 flex h-20 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 px-4 text-white font-bold text-xl shadow-md hover:opacity-90 transition-opacity"
      >
        Ratu Rosari Inventory
      </div>
      <nav className="flex flex-col gap-2 px-3 flex-1">
        <NavLinks />
      </nav>
      <div className="mx-3 mb-4 border-t border-gray-200"></div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="flex h-[48px] w-[90%] mx-auto mb-4 items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-600 shadow-sm transition-all duration-200">
          <PowerIcon className="w-5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </form>
    </aside>
  );
}
