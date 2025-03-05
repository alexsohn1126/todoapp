import { NavLink } from "react-router";
import logo from "./assets/logo.png";

function SideBar() {
  return (
    <div className="flex flex-col gap-1 min-h-svh min-w-[10svw] bg-neutral-800 text-neutral-50">
      <img
        src={logo}
        className="w-[50%] self-center drop-shadow-[0_0_16px_#404040] [image-rendering:pixelated]"
      />
      <NavLink
        className="h-8 mx-3 flex items-center rounded-md hover:bg-neutral-700"
        to="/"
      >
        <div className="ml-3">Home</div>
      </NavLink>
      <NavLink
        className="h-8 mx-3 flex items-center rounded-md hover:bg-neutral-700"
        to="/notes"
      >
        <div className="ml-3">Notes</div>
      </NavLink>
    </div>
  );
}

export default SideBar;
