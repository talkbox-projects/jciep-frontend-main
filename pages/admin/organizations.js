import {
  Avatar,
  CircularProgress,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  Tag,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";

import Container from "../../components/Container";
import organizationSearch from "../../utils/api/OrganizationSearch";
import { getPage } from "../../utils/page/getPage";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import NextLink from "next/link";
import { useRouter } from "next/router";
import MultiSelect from "react-select";
import React, { useCallback, useEffect, useState } from "react";

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
    status: enums?.EnumOrganizationStatusList.map((x) => x.key),
    type: enums?.EnumOrganizationTypeList.map((x) => x.key),
    name: "",
    days: "",

  });

  const fetchOrganizations = useCallback(
    async ({ status, type, name , days}) => {

      try {
        setIsLoading(true);
        setOrganizations(await organizationSearch({ status, type, name, days }));
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    },
    [setOrganizations]
  );

  useEffect(() => {
    fetchOrganizations({
      status: params?.status,
      type: params?.type,
      name: params?.name,
      days: params?.days,
      
    });
  }, [fetchOrganizations, params]);

  const getTypeFilter = () => {
    const options = (enums?.EnumOrganizationTypeList ?? []).map(
      ({ key: value, value: { [router.locale]: label } }) => ({
        label,
        value,
      })
    );
    return (
      <MultiSelect
        placeholder="請選擇"
        width="100%"
        value={options.filter((x) => params?.type.includes(x.value))}
        onChange={(options) =>
          setParams((_) => ({ ..._, type: options.map((x) => x.value) }))
        }
        isMulti={true}
        options={options}
      ></MultiSelect>
    );
  };

  const getStatusFilter = () => {
    const options = (enums?.EnumOrganizationStatusList ?? []).map(
      ({ key: value, value: { [router.locale]: label } }) => ({
        label,
        value,
      })
    );
    return (
      <MultiSelect
        placeholder="請選擇"
        width="100%"
        value={options.filter((x) => params?.status.includes(x.value))}
        onChange={(options) =>
          setParams((_) => ({ ..._, status: options.map((x) => x.value) }))
        }
        isMulti={true}
        options={options}
      ></MultiSelect>
    );
  };

  const getDaysFilter = () => {
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
        
  };

  return (
    <VStack align="stretch" pt={[24, 48]}>
      <Container>
        <Text fontSize="4xl" fontWeight="bold">
          管理介面
        </Text>

        <SimpleGrid gap={4} columns={[1, 1, 1, 2]} mt={6}>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>組織名稱</FormLabel>
              <Input
                value={params?.name}
                onChange={(e) =>
                  setParams({ ...params, name: e.target.value })
                }
              ></Input>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>組織類別</FormLabel>
              {getTypeFilter()}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel mb={0.5}>組織狀態</FormLabel>
              {getStatusFilter()}
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
            organizations.map((organization) => {
              const hasPendingApproval =
                (organization?.submission ?? [])?.[0]?.status ===
                "pendingApproval";
              return (
                <NextLink key={organization.id} href={`/user/organization/${organization.id}`}>
                  <SimpleGrid columns={3} marginTop="0px">
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px"   >
                    <Avatar size="sm" src={organization?.logo?.url}></Avatar>
                    <Text display="inline-block" marginLeft="10px">
                      {router.locale === "zh"
                        ? organization?.chineseCompanyName
                        : organization?.englishCompanyName}
                    </Text>
                    </GridItem>
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px">
                    <Text ver>
                        {moment(organization?.createdAt).format("YYYY-MM-DD hh:mm a")}

                    </Text>
                    </GridItem>
                    <GridItem  borderBottom="1px solid lightgrey" padding="20px 0px" marginTop="0px" textAlign="right">
                    {hasPendingApproval && <Tag>待處理申請</Tag>}
                    </GridItem>
                  </SimpleGrid>
                </NextLink>
              );
            })}
        </VStack>
      </Container>
    </VStack>
  );
};

export default AdminOrganization;
