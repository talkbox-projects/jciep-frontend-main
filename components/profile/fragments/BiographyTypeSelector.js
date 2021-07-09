import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";
import wordExtractor from "../../../utils/wordExtractor";

const BiographyTypeSelector = ({
  labelVisible = true,
  page,
  onArrayAppend,
}) => {
  return (
    <Menu placement="bottom-end">
      {labelVisible ? (
        <MenuButton
          size="sm"
          as={Button}
          variant="outline"
          leftIcon={<RiAddFill />}
        >
          {wordExtractor(
            page?.content?.wordings,
            "button_label_biography_insert"
          )}
        </MenuButton>
      ) : (
        <MenuButton
          size="sm"
          as={IconButton}
          variant="ghost"
          icon={<RiAddFill />}
        ></MenuButton>
      )}
      <MenuList>
        <MenuItem onClick={() => onArrayAppend({ type: "youtube" })}>
          {wordExtractor(
            page?.content?.wordings,
            "button_label_biography_youtube"
          )}
        </MenuItem>
        <MenuItem onClick={() => onArrayAppend({ type: "image" })}>
          {wordExtractor(
            page?.content?.wordings,
            "button_label_biography_image"
          )}
        </MenuItem>
        <MenuItem onClick={() => onArrayAppend({ type: "text" })}>
          {wordExtractor(
            page?.content?.wordings,
            "button_label_biography_text"
          )}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default BiographyTypeSelector;
