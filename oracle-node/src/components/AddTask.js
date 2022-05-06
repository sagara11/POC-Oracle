import { useState } from "react";
import { Button, HStack, Input, useToast } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { getPriceBinance } from "../GetPriceAPI";
import { updateOracleContract } from "../OracleService";

function AddTask({ addTask }) {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [statusInput, setStatusInput] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskText = content.trim();

    if (!taskText) {
      toast({
        title: "Digite sua tarefa",
        position: "top",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      setStatusInput(false);

      return setContent("");
    }

    const assets = taskText.split("-");
    const from = assets[0];
    const to = assets[1];
    const priceBinance = await getPriceBinance(taskText.replace("-", ""));
    await updateOracleContract({ from, to, priceBinance });

    const task = {
      id: nanoid(),
      body: taskText,
      price: priceBinance,
      check: false,
    };

    addTask(task);
    setContent("");
  };

  if (content && !statusInput) {
    setStatusInput(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <HStack mt="4" mb="4">
        <Input
          h="46"
          borderColor={!statusInput ? "red.300" : "transparent"}
          variant="filled"
          placeholder="Assets"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button colorScheme="blue" px="8" pl="10" pr="10" h="46" type="submit">
          Add Assets
        </Button>
      </HStack>
    </form>
  );
}

export default AddTask;
