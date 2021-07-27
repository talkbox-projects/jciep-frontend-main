import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Input,
  Tag,
  SimpleGrid,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import moment from "moment";

import Container from "../../components/Container";
import identitySearch from "../../utils/api/IdentitySearch";
import { getPage } from "../../utils/page/getPage";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import NextLink from "next/link";
import { useRouter } from "next/router";
import MultiSelect from "react-select";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import wordExtractor from "../../utils/wordExtractor";

const PAGE_KEY = "identity_id_profile";

const PAGE_LIMIT = 5;

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

const AdminIdentity = ({ enums }) => {
  const router = useRouter();

  const [identities, setIdentities] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({
    limit: PAGE_LIMIT,
    page: 1,
    identityType: enums?.EnumIdentityTypeList.map((x) => x.key),
    name: "",
    days: ""
  });

  const fetchIdentities = useCallback(
    async ({ identityType, name, limit, page , days}) => {
      try {
        setIsLoading(true);
        setIdentities(
          await identitySearch({ limit, page, identityType, name, days })
        );
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    },
    [setIdentities]
  );

  useEffect(() => {
    fetchIdentities({
      identityType: params?.identityType,
      name: params?.name,
      limit: params?.limit,
      page: params?.page,
      days: params?.days
    });
  }, [fetchIdentities, params]);

  const getTypeFilter = useCallback(() => {
    const options = (enums?.EnumIdentityTypeList ?? []).map(
      ({ key: value, value: { [router.locale]: label } }) => ({
        label,
        value,
      })
    );
    return (
      <MultiSelect
        placeholder="請選擇"
        width="100%"
        value={options.filter((x) => params?.identityType.includes(x.value))}
        onChange={(options) =>
          setParams((_) => ({
            ..._,
            page: 1,
            limit: PAGE_LIMIT,
            identityType: options.map((x) => x.value),
          }))
        }
        isMulti={true}
        options={options}
      ></MultiSelect>
    );
  }, [enums, params]);

  const getDaysFilter = useCallback(() => {
    const options = [
      { value: "All", label: 'All' },
      { value: "7 Days", label: '7 Days' },
      { value: "1 Month", label: '1 Month' },
      { value: "3 Months", label: '3 Months' }
    ]
    
    return  <MultiSelect
    placeholder="選擇"
    width="100%"
    onChange={(options) =>
      setParams((_) => ({ ..._, days: options.value}))
    }
    options={options}
  ></MultiSelect>
        
  })

  const onPrev = useCallback(() => {
    setParams((_) => ({
      ..._,
      page: Math.max(0, _?.page - 1),
    }));
  }, []);
  const onNext = useCallback(() => {
    setParams((_) => ({
      ..._,
      page: _?.page + 1,
    }));
  }, []);

  return (
    <VStack align="stretch" pt={[24, 48]}>
      <Container>
        <Text fontSize="4xl" fontWeight="bold">
          用戶管理介面
        </Text>

        <SimpleGrid gap={4} columns={[1, 1, 1, 2]} mt={6}>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>用戶名稱</FormLabel>
              <Input
                value={params?.name}
                onChange={(e) =>
                  setParams((_) => ({
                    ...params,
                    page: 1,
                    limit: PAGE_LIMIT,
                    name: e.target.value,
                  }))
                }
              ></Input>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>用戶類別</FormLabel>
              {getTypeFilter()}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>登記日期</FormLabel>
              {getDaysFilter()}
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <VStack align="stretch" mt={12}>
          {isLoading && <CircularProgress alignSelf="center" my={16} />}
          {!isLoading &&
            identities.map((identity) => {
              const hasPendingApproval =
                (identity?.submission ?? [])?.[0]?.status === "pendingApproval";
              return (
                <NextLink href={`/user/identity/${identity.id}`}>
                  {/* <HStack
                    borderBottomWidth={1}
                    borderColor="#eee"
                    spacing={4}
                    px={6}
                    py={4}
                    key={identity.id}
                    _hover={{
                      bg: "#fafafa",
                    }}
                    cursor="pointer"
                  >
                    <Avatar size="sm" src={identity?.logo?.url}></Avatar>
                    <Text>
                      {router.locale === "zh"
                        ? identity?.chineseName
                        : identity?.englishName}
                    </Text>
                    <Box flex={1} minW={0} w="100%"></Box>
                    <Tag>
                      {
                        enums.EnumIdentityTypeList.find(
                          (data) => data.key === identity.type
                        )?.value[router.locale]
                      }
                    </Tag>
                    {hasPendingApproval && <Tag>待處理申請</Tag>}
                  </HStack> */}
                  <SimpleGrid columns={3} marginTop="0px">
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px"   >
                    <Avatar size="sm" src={identity?.logo?.url}></Avatar>
                    <Text display="inline-block" marginLeft="10px">
                      {router.locale === "zh"
                        ? identity?.chineseName
                        : identity?.englishName}
                    </Text>
                    </GridItem>
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px">
                    <Text ver>
                        {moment(identity?.createdAt).format("YYYY-MM-DD hh:mm a")}

                    </Text>
                    </GridItem>
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px" textAlign="right">
                    <Tag>
                      {
                        enums.EnumIdentityTypeList.find(
                          (data) => data.key === identity.type
                        )?.value[router.locale]
                      }
                    </Tag>
                    {hasPendingApproval && <Tag>待處理申請</Tag>}
                    </GridItem>
                    </SimpleGrid>
                </NextLink>
              );
            })}
          <HStack>
            <IconButton
              isDisabled={params?.page === 1}
              onClick={onPrev}
              icon={<AiOutlineArrowLeft />}
            ></IconButton>
            <Box flex={1} minW={0} w="100%"></Box>
            <IconButton
              isDisabled={identities?.length < PAGE_LIMIT}
              onClick={onNext}
              icon={<AiOutlineArrowRight />}
            ></IconButton>
          </HStack>
        </VStack>
      </Container>
    </VStack>
  );
};

export default AdminIdentity;
