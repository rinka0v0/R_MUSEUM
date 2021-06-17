/**@jsxRuntime classic */
/** @jsx jsx */

import React, { useState } from "react";
import { VFC } from "react";
import { jsx, css } from "@emotion/react";
import { Box } from "@chakra-ui/layout";

import { ListItem, UnorderedList, Button, Input } from "@chakra-ui/react";

const TagInput: VFC = () => {
  const [tags, setTags] = useState<string[]>([]);

  const inputKeyDown = (e: any) => {
    const val = e?.target.value;
    if (e?.key === "Enter" && val) {
      if (tags.find((tag) => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      e.target.value = "";
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1);
    }
  };

  const removeTag = (i: number) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  return (
    <>
      <Box>
        <UnorderedList>
          {tags.map((tag, index) => {
            return (
              <ListItem key={tag}>
                {tag}
                <Button type="button" onClick={() => removeTag(index)}>
                  ✖️
                </Button>
              </ListItem>
            );
          })}
        </UnorderedList>
        <Input
          placeholder="使用した技術"
          onKeyUp={(e) => inputKeyDown(e)}
        ></Input>
      </Box>
    </>
  );
};

export default TagInput;
