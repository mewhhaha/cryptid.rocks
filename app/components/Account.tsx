import React from "react";
import { LogoutIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import { DropdownMenu, DropdownMenuItem } from "./DropdownMenu";
import { Auth0Profile } from "remix-auth-auth0";
import { Form } from "remix";

type AccountProps = {
  user: Auth0Profile;
};

export const Account: React.VFC<AccountProps> = ({ user }) => {
  return (
    <div className="flex-none w-12 h-12">
      <DropdownMenu
        position="left"
        button={
          <Menu.Button className="overflow-hidden bg-gray-400 rounded-full shadow-md opacity-50 focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-500 hover:opacity-100 ">
            <img src={user.photos[0]?.value} alt="profile" />
          </Menu.Button>
        }
      >
        <Form action="/auth/logout">
          <DropdownMenuItem type="submit">
            <LogoutIcon className="w-5 h-5" />
            <span className="pl-2 whitespace-nowrap">Sign out</span>
          </DropdownMenuItem>
        </Form>
      </DropdownMenu>
    </div>
  );
};
