import { Outlet } from "@remix-run/react";
import { NavBar } from "~/components/navBar";

export default function Index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
