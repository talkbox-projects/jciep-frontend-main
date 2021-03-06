

import { Box, Menu,MenuButton ,IconButton, MenuList, MenuItem , Text} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiFacebookBoxLine, RiLinksLine, RiShareLine, RiWhatsappLine } from "react-icons/ri";
import useClipboard from "react-use-clipboard";




const ShareBox = ({ identityId = "" }) => {

    const [url, setUrl] = useState("");
    useEffect(() => {
        setUrl(`${window.location.host}/talants/individuals?identityId=${identityId}`);
    }, [identityId])
    const [, setCopied] = useClipboard(url);


    return <Box>
        <Menu>
            <MenuButton as={IconButton} borderRadius="50%" icon={<RiShareLine />} />
            <MenuList>
                <MenuItem onClick={() => window.open(`https://wa.me/?text=${url}`)} icon={<RiWhatsappLine size={20} />}>Whatsapp</MenuItem>
                <MenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)}  icon={<RiFacebookBoxLine size={20} />}>Facebook</MenuItem>
                
                <MenuItem onClick={setCopied} icon={<RiLinksLine size={20} />}><Text>Copy Link</Text></MenuItem>
            </MenuList>
        </Menu>
    </Box>;
}

export default ShareBox;