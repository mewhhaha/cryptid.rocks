import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cx } from "app/helpers";

type MenuProps = {
  children: React.ReactNode;
  button: React.ReactNode;
};

export const Menu = ({ children, button }: MenuProps) => {
  return (
    <HeadlessMenu
      as="div"
      className="relative flex items-center justify-center text-left"
    >
      <HeadlessMenu.Button className="inline-flex w-full items-center justify-center rounded-md bg-black bg-opacity-20 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {button}
      </HeadlessMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute left-0 top-full z-10 mt-2 w-56 origin-top-right space-y-1 divide-y divide-gray-100 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {children}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};

type MenuItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

const MenuItem = ({ icon, children }: MenuItemProps) => {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-orange-500 text-white" : "text-gray-900"
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          <span
            className={cx(
              "mr-2 inline-block h-5 w-5",
              active ? "text-white" : "text-orange-400"
            )}
          >
            {icon}
          </span>
          {children}
        </button>
      )}
    </HeadlessMenu.Item>
  );
};

Menu.Item = MenuItem;
