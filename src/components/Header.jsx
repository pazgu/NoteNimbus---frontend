/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import logo from "../assets/logo.jpeg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const { loggedInUser, logout } = useContext(AuthContext);

  if (loggedInUser === undefined) return;
  return (
    <header className="bg-white/5 px-4 flex justify-between items-center h-14">
      <div className="flex items-center gap-2">
        <Link
          className="text-primary font-bold text-xl flex items-center"
          to="/"
        >
          <img className="h-8 w-8 mr-2 rounded-lg" src={logo} alt="Logo" />
          NoteNimbus
        </Link>
      </div>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link to={`/notes/${loggedInUser?.userId}`}>Notes</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src={loggedInUser?.imgUrl} />
              <AvatarFallback>
                {loggedInUser?.username
                  ? loggedInUser.username[0].toUpperCase()
                  : "P"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <Link>My Account</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/profile/${loggedInUser?.userId}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
