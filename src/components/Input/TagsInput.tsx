/**@jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { VFC } from "react";
import { jsx, css } from "@emotion/react";
import { Box, Flex } from "@chakra-ui/layout";
import { UnorderedList, Input, ListItem } from "@chakra-ui/react";

type Props = {
  tags: Array<string>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const TagInput: VFC<Props> = (props) => {
  const { tags, setTags } = props;

  const inputKeyDown = (e: any) => {
    const val: string = e?.target.value;
    if (e?.key === "Enter" && val) {
      if (tags.find((tag) => tag.toLowerCase().trim() === val.trim().toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      e.target.value = " ";
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1);
      e.target.value = " ";
    }
  };

  const removeTag = (i: number) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  return (
    <Flex
      alignItems="center"
      justify="center"
      boxSizing="border-box"
      css={container}
    >
      <Box className="tags-input">
        <UnorderedList id="tags">
          {tags.map((tag, index) => {
            return (
              <ListItem key={tag} className="tag">
                <Box as="span" className="tag-title">
                  {tag}
                </Box>
                <Box
                  as="span"
                  className="tag-close-icon"
                  onClick={() => removeTag(index)}
                >
                  ✖️
                </Box>
              </ListItem>
            );
          })}
        </UnorderedList>
        <Input
          placeholder="使用した技術など"
          onKeyUp={(e) => inputKeyDown(e)}
          flex="1"
          h="46px"
          padding="4px 0 0 0"
          _focus={{ outline: "transparent" }}
          disabled={tags.length >= 5}
        ></Input>
      </Box>
    </Flex>
  );
};

const container = css`
  .tags-input {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    min-height: 48px;
    width: 100%;
    padding: 0 8px;
    border: 1px solid rgb(214, 216, 218);
    border-radius: 6px;
    &:focus-within {
      border: 1px solid #0052cc;
    }
    input {
      flex: 1;
      border: none;
      height: 46px;
      font-size: 14px;
      padding: 4px 0 0 0;
      &:focus {
        outline: transparent;
      }
    }
  }

  #tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;
  }

  .tag {
    width: auto;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0 8px;
    font-size: 14px;
    list-style: none;
    border-radius: 6px;
    margin: 0 8px 8px 0;
    background: #0052cc;
    .tag-title {
      margin-top: 3px;
    }
    .tag-close-icon {
      display: block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 14px;
      margin-left: 8px;
      color: #0052cc;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 567px) {
    .tags-input {
      width: calc(100vw - 32px);
    }
  }
`;

export default TagInput;
