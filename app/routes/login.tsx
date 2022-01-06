import { FingerPrintIcon } from "@heroicons/react/solid";
import { Form } from "remix";

const Login: React.FC = () => {
  return (
    <main className="flex flex-col items-center h-screen w-screen">
      <header className="flex w-full justify-center items-center py-8">
        <Form action="/auth/login" className="w-12 h-12 flex-none">
          <button
            type="submit"
            className="w-12 h-12 overflow-hidden rounded-full p-4 focus:outline-none focus-visible:outline-none bg-gray-400 focus-visible:ring focus-visible:ring-blue-500 opacity-50 shadow-md hover:opacity-100 "
          >
            <FingerPrintIcon />
          </button>
        </Form>
      </header>
    </main>
  );
};

export default Login;
