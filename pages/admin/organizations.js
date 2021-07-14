import {
  Avatar,
  Box,
  CircularProgress,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import Container from "../../components/Container";
import organizationSearch from "../../utils/api/OrganizationSearch";
import { getPage } from "../../utils/page/getPage";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const AdminOrganization = ({ enums }) => {
  const router = useRouter();

  const [organizations, setOrganizations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({
    status: [],
    type: ["employment", "ngo"],
  });

  const fetchOrganizations = useCallback(
    async ({ status, type }) => {
      try {
        setOrganizations(await organizationSearch({ status, type }));
      } catch (error) {
        console.error(error);
      }
    },
    [setOrganizations]
  );

  useEffect(() => {
    fetchOrganizations({
      status: params?.status,
      type: params?.type,
    });
  }, [fetchOrganizations, params]);

  return (
    <VStack align="stretch" pt={[24, 48]}>
      <Container>
        <Text fontSize="4xl" fontWeight="bold">
          管理介面
        </Text>

        <HStack>
          <Select variant="flushed" color="primary">
            {(enums?.EnumOrganizationTypeList ?? []).map(
              ({ key: value, value: { [router.locale]: label } }) => {
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              }
            )}
          </Select>
        </HStack>

        <VStack align="stretch" mt={12}>
          {isLoading && <CircularProgress alignSelf="center" my={16} />}
          {!isLoading &&
            organizations.map((organization) => {
              return (
                <NextLink href={`/user/organization/${organization.id}`}>
                  <HStack
                    spacing={4}
                    px={6}
                    py={4}
                    key={organization.id}
                    _hover={{
                      bg: "#fafafa",
                    }}
                    cursor="pointer"
                  >
                    <Avatar size="sm" src={organization?.logo?.url}></Avatar>
                    <Text>
                      {router.locale === "zh"
                        ? organization?.chineseCompanyName
                        : organization?.englishCompanyName}
                    </Text>
                  </HStack>
                </NextLink>
              );
            })}
        </VStack>
      </Container>
    </VStack>
  );
};

export default AdminOrganization;
