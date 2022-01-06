import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import cn from "classnames";

type DropdownMenuItemProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "className"
>;

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = (props) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          {...props}
          className={cn(
            active ? "bg-yellow-200 text-black" : "text-gray-900",
            "group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100"
          )}
        />
      )}
    </Menu.Item>
  );
};

type DropdownMenuProps = {
  button: React.ReactNode;
  position?: "left" | "right";
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  button,
  position = "right",
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {button}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            {
              "left-0 origin-top-left": position === "right",
              "right-0 origin-top-right": position === "left",
            },
            "absolute z-10  mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          )}
        >
          <div className="px-1 py-1 ">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
