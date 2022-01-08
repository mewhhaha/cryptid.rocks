import React from "react";
import { LogoutIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import { DropdownMenu, DropdownMenuItem } from "./DropdownMenu";
import { Form } from "remix";
import cn from "classnames";
import { usePortfolio } from "~/contexts/portfolio";
import { useProfile } from "~/contexts/profile";

export const Account: React.VFC = () => {
  const profile = useProfile();
  const { status } = usePortfolio();

  return (
    <div className="flex-none w-12 h-12">
      <DropdownMenu
        position="left"
        button={
          <Menu.Button
            className={cn(
              {
                "border-green-400": status === "open",
                "border-blue-600": status === "closed",
              },
              "border overflow-hidden bg-gray-400 rounded-full shadow-md opacity-50 focus:outline-none",
              "focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-500 hover:opacity-100"
            )}
          >
            <img src={profile.photos[0]?.value} alt="profile" />
          </Menu.Button>
        }
      >
        <Form method="post" action="/auth/logout">
          <DropdownMenuItem type="submit">
            <LogoutIcon className="w-5 h-5" />
            <span className="pl-2 whitespace-nowrap">Sign out</span>
          </DropdownMenuItem>
        </Form>
      </DropdownMenu>
    </div>
  );
};
