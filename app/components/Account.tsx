import React, { useEffect, useState } from "react";
import { FingerPrintIcon, LogoutIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import { DropdownMenu, DropdownMenuItem } from "./DropdownMenu";
import { Auth0Profile } from "remix-auth-auth0";
import { Form } from "remix";

type AccountProps = {
  user: Auth0Profile;
};

export const Account: React.VFC<AccountProps> = ({ user }) => {
  return (
    <div className="w-12 h-12 flex-none">
      <DropdownMenu
        position="left"
        button={
          <Menu.Button className="rounded-full overflow-hidden focus:outline-none focus-visible:outline-none bg-gray-400 focus-visible:ring focus-visible:ring-blue-500 opacity-50 shadow-md hover:opacity-100 ">
            <img src={user.photos[0]?.value} />
          </Menu.Button>
        }
      >
        <Form action="/auth/logout">
          <DropdownMenuItem type="submit">
            <LogoutIcon className="w-5 h-5" />
            <span className="whitespace-nowrap pl-2">Sign out</span>
          </DropdownMenuItem>
        </Form>
      </DropdownMenu>
    </div>
  );
};
