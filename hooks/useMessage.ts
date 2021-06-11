import { useCallback } from "react";
import { useToast } from "@chakra-ui/toast";
type Props = {
  title: string;
  status: "info" | "warning" | "success" | "error";
};

const useMessage = () => {
  const toast = useToast();
  const showMessage = useCallback(
    (props: Props) => {
      const { title, status } = props;
      toast({
        title,
        status,
        position: "bottom",
        duration: 2000,
        isClosable: true,
      });
    },
    [toast]
  );
  return { showMessage };
};

export default useMessage;
