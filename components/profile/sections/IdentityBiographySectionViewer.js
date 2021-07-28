import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import { RiEdit2Line } from "react-icons/ri";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import { useAppContext } from "../../../store/AppStore";
import {useEffect, useState} from "react";

export const IdentityBiographySectionViewer = () => {
  const { page, identity, setEditSection, isAdmin, editable, editSection } =
    IdentityProfileStore.useContext();

    const { identity: { id, type, organizationRole} = {} } = useAppContext();
  const [staffAccess, setStaffAccess] = useState(false) 
  
  useEffect(async () => {
    if (type === "staff" && organizationRole?.length> 0) {
      let IdentityRole = (identity.organizationRole)
      
     let hasStaffAccess =  IdentityRole.filter(role =>  
        role.organization.id === organizationRole[0].organization.id
        && organizationRole[0].role === "staff" 
        && organizationRole[0].status === "joined" 
      )[0]
       
     if(hasStaffAccess) {
      setStaffAccess(true)
     } else {
      setStaffAccess(false)
     }   
    }

  }, [type, identity])


  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl" fontFamily="SFNSDisplay"  >
          {wordExtractor(page?.content?.wordings, "biography_header_label")}
        </Text>

        {(isAdmin || editable || staffAccess) && !editSection && (
          <Button
            onClick={() => setEditSection("biography")}
            variant="link"
            leftIcon={<RiEdit2Line />}
          >
            {wordExtractor(page?.content?.wordings, "section_edit_label")}
          </Button>
        )}
      </HStack>
      {(identity?.biography?.blocks ?? []).map(
        ({ id, type, youtubeUrl, text, file }, index) => {
          let comp = null;
          switch (type) {
            case "youtube":
              const youtubeLink = getYoutubeLink(youtubeUrl);
              comp = (
                <AspectRatio w="100%" ratio={16 / 9}>
                  <iframe src={youtubeLink} allowFullScreen />
                </AspectRatio>
              );
              break;
            case "image":
              comp = <Image src={file?.url} />;
              break;
            case "text":
              comp = <Text whiteSpace="pre-line">{text}</Text>;
              break;
            default:
          }
          return (
            <HStack key={id} align="start">
              {comp}
            </HStack>
          );
        }
      )}
    </VStack>
  );
};

export default IdentityBiographySectionViewer;
