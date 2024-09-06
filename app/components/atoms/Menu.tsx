import { Transition } from "@headlessui/react";
import * as Headless from "@headlessui/react";
import { Fragment } from "react";
import { cx } from "~/helpers/cx";

type MenuProps = {
  children: React.ReactNode;
  button: React.ReactNode;
};

export const Menu = ({ children, button }: MenuProps) => {
  return (
    <Headless.Menu
      as="div"
      className="relative flex items-center justify-center text-left"
    >
      <Headless.MenuButton className="inline-flex w-full items-center justify-center rounded-md bg-black/20 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
        {button}
      </Headless.MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Headless.MenuItems className="absolute left-0 top-full z-10 mt-2 w-56 origin-top-right space-y-1 divide-y divide-gray-100 rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          {children}
        </Headless.MenuItems>
      </Transition>
    </Headless.Menu>
  );
};

type MenuItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

const MenuItem = ({ icon, children }: MenuItemProps) => {
  return (
    <Headless.MenuItem>
      {({ focus }) => (
        <button
          className={`${
            focus ? "bg-orange-500 text-white" : "text-gray-900"
          } group flex w-full items-center rounded-md p-2 text-sm`}
        >
          <span
            className={cx(
              "mr-2 inline-block size-5",
              focus ? "text-white" : "text-orange-400",
            )}
          >
            {icon}
          </span>
          {children}
        </button>
      )}
    </Headless.MenuItem>
  );
};

Menu.Item = MenuItem;
