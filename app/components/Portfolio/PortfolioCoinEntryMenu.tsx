import React from "react";
import { Menu } from "@headlessui/react";
import {
  DotsHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import cn from "classnames";
import { PortfolioCoin } from "workers/portfolio/portfolio";
import { DropdownMenu, DropdownMenuItem } from "../DropdownMenu";

type PortfolioCoinEntryMenuProps = {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
  coin: PortfolioCoin;
};

export const PortfolioCoinEntryMenu: React.VFC<PortfolioCoinEntryMenuProps> = ({
  onDelete,
  coin: { id, name },
}) => {
  return (
    <DropdownMenu
      position="left"
      button={
        <Menu.Button className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-800 rounded-full hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-opacity-75">
          <DotsHorizontalIcon className="w-5 h-5" />
        </Menu.Button>
      }
    >
      <DropdownMenuItem
        onClick={() => {
          window.location.href = `https://www.coingecko.com/en/coins/${id}`;
        }}
      >
        <LinkIcon className="w-5 h-5" />
        <span className={cn("whitespace-nowrap pl-2")}>{`Go to ${name}`}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDelete}>
        <TrashIcon className="w-5 h-5" />
        <span className={cn("whitespace-nowrap pl-2")}>{`Delete ${name}`}</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
};
