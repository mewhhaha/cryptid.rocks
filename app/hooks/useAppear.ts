import { useEffect, useState } from "react";

export const useAppear = () => {
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppear(true);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return appear;
};
