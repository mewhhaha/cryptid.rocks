import { FingerPrintIcon } from "@heroicons/react/solid";
import { Form, useTransition } from "remix";
import cn from "classnames";

const Login: React.FC = () => {
  const transition = useTransition();
  return (
    <main className="flex flex-col items-center w-screen h-screen">
      <header className="flex items-center justify-center w-full py-8">
        <Form
          method="post"
          action="/auth/login"
          className="flex-none w-12 h-12"
        >
          <button
            type="submit"
            disabled={transition.state !== "idle"}
            className={cn(
              {
                "animate-pulse": transition.state === "submitting",
              },
              "w-12 h-12 p-4 overflow-hidden bg-gray-400 rounded-full shadow-md opacity-50 focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-500 hover:opacity-100"
            )}
          >
            <FingerPrintIcon />
          </button>
        </Form>
      </header>
    </main>
  );
};

export default Login;
