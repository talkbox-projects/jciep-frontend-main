import React, { useCallback, useState, useRef } from "react";
import axios from "axios";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  VStack,
  Grid,
  GridItem,
  Box,
  Text,
  Link,
  Button,
  Stack,
  Flex,
  Image,
  Input,
  Textarea,
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import { useAppContext } from "../../store/AppStore";
import ReactSelect from "react-select";
import moment from "moment";
import { gql } from "graphql-request";
import { getStockPhoto } from "../../utils/event/getEvent";
import { getGraphQLClient } from "../../utils/apollo";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

import { BsPlus } from "react-icons/bs";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import EventBiographySectionEditor from "../../components/profile/sections/EventBiographySectionEditor";

import { AiOutlineInfoCircle, AiFillMinusCircle } from "react-icons/ai";

const PAGE_KEY = "event_add";
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0px",
    border: "none",
    borderBottom: "1px solid #EFEFEF",
  }),
};

const labelStyles = {
  marginBottom: "0px",
};

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  const stockPhotos = (await getStockPhoto()) ?? {};
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      stockPhotos,
    },
  };
};

const EventAdd = ({ page, stockPhotos }) => {
  const { user } = useAppContext();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      name: "發展智障人士的「斜槓事業」 demo",
      otherUrl: ["https://www.demo.com"],
      type: "class",
      description: "成爲很多青年心儀的就業選項",
      startDate: "2023-05-20",
      endDate: "2023-05-23",
      venue: "kwunTong",
      freeOrCharge: "free",
      submissionDeadline: "2023-05-18",
      stockPhoto: "placeholder-event(helping)",
    },
  });
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState("step1");
  const [fileError, setFileError] = useState(false);
  const [formState, setFormState] = useState([]);
  const watchFields = watch(["type", "freeOrCharge"], { type: [] });
  const getDescriptionCount = watch("description", 0);
  const getDateTimeRemarkCount = watch("datetimeRemark", 0);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherUrl",
  });
  const onFileUpload = async (e) => {
    let uploadedFiles = await e.target.files[0];
    setFileError("");
    setFiles([uploadedFiles]);
  };
  const ImagesComponent = () => {
    const inputRef = useRef(null);
    const UploadBox = () => (
      <GridItem
        borderRadius={"5px"}
        overflow={"hidden"}
        border={"1px solid #EFEFEF"}
        color={"#666666"}
        cursor={"pointer"}
        pos={"relative"}
        onClick={() => {
          inputRef.current.click();
        }}
      >
        <Input
          type="file"
          opacity={0}
          onChange={onFileUpload}
          pos={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={2}
          h={"100%"}
          ref={inputRef}
        />
        <Center h={"100%"} fontSize={"14px"} pos={"relative"} zIndex={1}>
          <Stack direction="column" alignItems={"center"} spacing={2}>
            <BsPlus />
            <Text>
              {" "}
              {wordExtractor(
                page?.content?.wordings,
                "add_custom_images_label"
              )}
            </Text>
          </Stack>
        </Center>
      </GridItem>
    );

    const ImagesBox = () => {
      return files?.map((file, index) => {
        let url = URL.createObjectURL(file);
        return (
          <GridItem
            borderRadius={"5px"}
            overflow={"hidden"}
            key={url + index}
            border="2px solid #007878"
            pos="relative"
            cursor="pointer"
          >
            <Box position="absolute" top={2} right={2}>
              <AiFillMinusCircle
                color="#007878"
                fontSize={18}
                cursor="pointer"
                onClick={() => setFiles([])}
              />
            </Box>
            <Box
              bgImg={`url(${url})`}
              w={"100%"}
              h={"75px"}
              bgSize={"cover"}
              bgPosition={"center center"}
            />
          </GridItem>
        );
      });
    };

    return (
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={"20px"}
        width="100%"
      >
        {(stockPhotos || []).map((d) => (
          <GridItem borderRadius={"5px"} overflow={"hidden"} key={d.id}>
            <Box
              bgImg={`url('${d?.url}')`}
              w={"100%"}
              h={"75px"}
              bgSize={"cover"}
            />
          </GridItem>
        ))}

        {files.length > 0 ? <ImagesBox /> : <UploadBox />}

        {files.length > 0 && (
          <GridItem borderRadius={"5px"} overflow={"hidden"}>
            <Box position={"relative"}>
              <Input
                type="file"
                opacity={0}
                onChange={onFileUpload}
                onClick={(event) => (event.currentTarget.value = null)}
                pos={"absolute"}
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={2}
              />
              <Stack
                color="#007878"
                direction="row"
                fontSize="14px"
                alignItems="center"
                spacing={1}
              >
                <BsPlus />
                <Text>
                  {wordExtractor(
                    page?.content?.wordings,
                    "add_custom_image_label"
                  )}
                </Text>
              </Stack>
            </Box>
          </GridItem>
        )}

        <GridItem colSpan={{ base: 2, md: 4 }}>
          <Stack
            direction="row"
            fontSize="12px"
            color="#666666"
            alignItems="center"
            spacing={1}
          >
            <AiOutlineInfoCircle />
            <Text>
              {wordExtractor(
                page?.content?.wordings,
                "add_custom_image_description_label"
              )}
            </Text>
          </Stack>
        </GridItem>
      </Grid>
    );
  };
  // const HandleNumberInput = ({
  //   placeholder,
  //   fieldName,
  //   maxLength = 2,
  //   required = false,
  // }) => {
  //   return (
  //     <Input
  //       type="text"
  //       variant="flushed"
  //       placeholder={placeholder}
  //       maxLength={maxLength}
  //       {...register(fieldName, {
  //         required: required,
  //         maxLength: maxLength,
  //       })}
  //       onChange={(e) => {
  //         setValue(fieldName, e.target.value.replace(/[^0-9]/g, ""));
  //       }}
  //     />
  //   );
  // };

  const onFormSubmit = async ({
    name,
    type,
    typeOther,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    datetimeRemark,
    quota,
    venue,
    location,
    freeOrCharge,
    price,
    submissionDeadline,
    eventManager,
    contactNumber,
    registerUrl,
    otherUrl,
    stockPhotoId,
    remark,
    representOrganization,
    organizationId,
    organizationAdditionalInfo,
    banner,
    additionalInformation,
  }) => {
    // console.log("sub");

    // const FileUploadmutation = gql`
    //   mutation FileUpload($file: FileUpload!) {
    //     FileUpload(files: $file) {
    //       id
    //       url
    //       contentType
    //       fileSize
    //     }
    //   }
    // `;

    // console.log('additionalInformation[0]?.file-',additionalInformation[0]?.file)

    // let filesUploadData = await getGraphQLClient().request(FileUploadmutation, {
    //   file: additionalInformation[0]?.file,
    // });

    const input = Object.fromEntries(
      Object.entries({
        name: name,
        type: type.value,
        typeOther: type.value === "other" ? typeOther : "",
        description: description,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        datetimeRemark: datetimeRemark,
        quota: quota,
        venue: venue,
        location: location,
        freeOrCharge: freeOrCharge,
        price: price,
        submissionDeadline: submissionDeadline,
        eventManager: eventManager,
        contactNumber: contactNumber,
        registerUrl: registerUrl,
        otherUrl: otherUrl,
        stockPhotoId: stockPhotoId,
        remark: remark,
        representOrganization: representOrganization,
        organizationId: organizationId,
        organizationAdditionalInfo: organizationAdditionalInfo,
        banner: additionalInformation[0]?.file,
        additionalInformation: [additionalInformation[0]?.file],
      }).filter(([_, v]) => v != null)
    );

    console.log("wo", input);

    axios.post('https://jciep.talkbox.io/api/app/event/create', input, {
      headers: { 
        'jciep-token': '1017299e-34f0-4206-ad25-243625dd5281', 
        'jciep-identityId': '62a03548b75ab2001b2c75ed'
      }
    })
    .then((res) => { console.table(res.data) })
    .catch((error) => { console.error(error) })

    // setFormState(input);
    // setStep("step2");
  };

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <VStack spacing={0} align="stretch" w="100%">
        <Box bgColor="#F6D644" position="relative">
          <Box position="absolute" bottom={0} w="100%">
            <DividerSimple primary="#FD5F53" />
          </Box>
          <Container pt={12} position="relative">
            <Box minHeight={{ base: "240px", md: "480px" }} />
          </Container>
        </Box>

        <Box bg="#fafafa" pb={12}>
          <Container
            position={"relative"}
            mt={{ base: "-140px", md: "-320px" }}
            pb={8}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 6 }}
              as="form"
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <Box flex={1}>
                <Flex direction={"column"} gap={6}>
                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                    }}
                    gap={6}
                    bgColor="#FFF"
                    borderRadius={"15px"}
                    p={6}
                  >
                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(page?.content?.wordings, "name_label")}
                        </FormLabel>
                        <Input
                          type="text"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "name_placeholder"
                          )}
                          {...register("name", { required: true })}
                        />
                        <FormHelperText>
                          {errors?.name?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "input_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {page?.content?.form?.type?.label}
                        </FormLabel>
                        <Controller
                          name="type"
                          isClearable
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <ReactSelect
                              aria-label={page?.content?.form?.type?.label}
                              {...field}
                              placeholder={wordExtractor(
                                page?.content?.wordings,
                                "type_placeholder"
                              )}
                              options={page?.content?.form?.type?.options.map(
                                ({ label, value }) => ({ label, value })
                              )}
                              styles={customStyles}
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors?.type?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "input_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>

                      {watchFields[0]?.value === "other" && (
                        <Box
                          pt={4}
                          p={6}
                          bgColor={"#FAFAFA"}
                          borderRadius={"15px"}
                        >
                          <FormControl>
                            <FormLabel {...labelStyles}>
                              {wordExtractor(
                                page?.content?.wordings,
                                "type_other_label"
                              )}
                            </FormLabel>
                            <Input
                              type="text"
                              variant="flushed"
                              placeholder={wordExtractor(
                                page?.content?.wordings,
                                "type_other_placeholder"
                              )}
                              {...register("typeOther", { required: true })}
                            />
                            <FormHelperText>
                              {errors?.typeOther?.type === "required" && (
                                <Text color="red">
                                  {wordExtractor(
                                    page?.content?.wordings,
                                    "input_required"
                                  )}
                                </Text>
                              )}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "description_label"
                          )}
                        </FormLabel>
                        <Textarea
                          row={4}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "description_placeholder"
                          )}
                          {...register("description", { required: true })}
                          maxLength={250}
                        />
                        <FormHelperText>
                          {errors?.description?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "description_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                      <Text fontSize="12px" color="#666666">
                        {wordExtractor(
                          page?.content?.wordings,
                          "word_suggestions"
                        ).replace("$", getDescriptionCount.length || 0)}
                      </Text>
                    </GridItem>
                  </Grid>
                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                    }}
                    gap={6}
                    bgColor="#FFF"
                    borderRadius={"15px"}
                    p={6}
                  >
                    <GridItem colSpan={2}>
                      <TitleWrap
                        title={wordExtractor(
                          page?.content?.wordings,
                          "date_venue_label"
                        )}
                      />
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "start_date_label"
                          )}
                        </FormLabel>
                        <Input
                          type="date"
                          variant="flushed"
                          placeholder=""
                          {...register("startDate", {
                            required: true,
                          })}
                        />

                        <FormHelperText>
                          {errors?.startDate?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "start_date_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "end_date_label"
                          )}
                        </FormLabel>
                        <Input
                          type="date"
                          variant="flushed"
                          placeholder=""
                          {...register("endDate", {
                            required: true,
                          })}
                        />
                        <FormHelperText>
                          {errors?.startDate?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "end_date_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "date_time_remark_label"
                          )}
                        </FormLabel>
                        <Textarea
                          row={4}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "date_time_remark_placeholder"
                          )}
                          {...register("datetimeRemark")}
                          maxLength={250}
                        />
                      </FormControl>
                      <Text fontSize="12px" color="#666666" pt={2}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "word_suggestions"
                        ).replace("$", getDateTimeRemarkCount.length || 0)}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "start_time_label"
                          )}
                        </FormLabel>

                        <Input
                          type="time"
                          variant="flushed"
                          placeholder=""
                          {...register("startTime")}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "end_time_label"
                          )}
                        </FormLabel>
                        <Input
                          type="time"
                          variant="flushed"
                          placeholder=""
                          {...register("endTime")}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "venue_label"
                          )}
                        </FormLabel>
                        <Input
                          type="text"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "venue_placeholder"
                          )}
                          {...register("venue", {
                            required: true,
                          })}
                        />
                        <FormHelperText>
                          {errors?.venue?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "input_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                    }}
                    gap={6}
                    bgColor="#FFF"
                    borderRadius={"15px"}
                    p={6}
                  >
                    <GridItem colSpan={2}>
                      <TitleWrap
                        title={wordExtractor(
                          page?.content?.wordings,
                          "event_registration_label"
                        )}
                      />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "free_or_charge_label"
                          )}
                        </FormLabel>
                        <Box pt={4}>
                          <Controller
                            name="freeOrCharge"
                            isClearable
                            control={control}
                            defaultValue={"free"}
                            rules={{ required: true }}
                            render={() => (
                              <RadioGroup
                                onChange={(value) =>
                                  setValue("freeOrCharge", value)
                                }
                                defaultValue={
                                  page?.content?.form?.freeOrCharge?.options[0]
                                    ?.value
                                }
                              >
                                <Stack direction="column">
                                  {page?.content?.form?.freeOrCharge?.options.map(
                                    ({ label, value }) => (
                                      <Radio
                                        key={label}
                                        value={value}
                                        size="md"
                                        colorScheme={"yellow"}
                                      >
                                        {label}
                                      </Radio>
                                    )
                                  )}
                                </Stack>
                              </RadioGroup>
                            )}
                          />
                        </Box>
                        <FormHelperText>
                          {errors?.freeOrCharge?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "input_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                      {watchFields[1] === "charge" && (
                        <Box
                          mt={4}
                          p={6}
                          bgColor={"#FAFAFA"}
                          borderRadius={"15px"}
                        >
                          <FormControl>
                            <FormLabel {...labelStyles}>
                              <FormLabel {...labelStyles}>
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "price_label"
                                )}
                              </FormLabel>
                            </FormLabel>
                            <Input
                              type="text"
                              variant="flushed"
                              {...register("price", {
                                required: watchFields[1] === "charge",
                              })}
                            />
                            <FormHelperText>
                              {errors?.price?.type === "required" && (
                                <Text color="red">
                                  {wordExtractor(
                                    page?.content?.wordings,
                                    "input_required"
                                  )}
                                </Text>
                              )}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "quota_label"
                          )}
                        </FormLabel>
                        <Input
                          type="number"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "quota_placeholder"
                          )}
                          {...register("quota")}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "submission_deadline_label"
                          )}
                        </FormLabel>
                        <Input
                          type="date"
                          variant="flushed"
                          placeholder=""
                          {...register("submissionDeadline", {
                            required: true,
                          })}
                        />
                        <FormHelperText>
                          {errors?.submissionDeadline?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "submission_deadline_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "event_manager_label"
                          )}
                        </FormLabel>
                        <Input
                          type="text"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "event_manager_placeholder"
                          )}
                          {...register("eventManager")}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "contact_number_label"
                          )}
                        </FormLabel>

                        <Input
                          type="text"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "contact_number_placeholder"
                          )}
                          {...register("contactNumber")}
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "register_url_label"
                          )}
                        </FormLabel>
                        <Input
                          type="text"
                          variant="flushed"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "register_url_placeholder"
                          )}
                          {...register("registerUrl")}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <FormControl>
                        <FormLabel {...labelStyles}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "other_url_label"
                          )}
                        </FormLabel>
                        {fields.map(({ id }, index) => (
                          <Box key={id} pb={2}>
                            <InputGroup>
                              <Input
                                type="text"
                                variant="flushed"
                                placeholder={wordExtractor(
                                  page?.content?.wordings,
                                  "other_url_placeholder"
                                )}
                                {...register(`otherUrl[${index}]`, {
                                  required: true,
                                })}
                              />
                              <InputRightElement>
                                {index !== 0 && (
                                  <AiFillMinusCircle
                                    color="red"
                                    fontSize={18}
                                    cursor="pointer"
                                    onClick={() => remove(index)}
                                  />
                                )}
                              </InputRightElement>
                            </InputGroup>
                          </Box>
                        ))}
                        <FormHelperText>
                          {errors?.otherUrl?.[0]?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "other_url_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                      <Flex
                        color="#007878"
                        align="center"
                        fontSize="12px"
                        mt={2}
                        cursor="pointer"
                        onClick={() => append([""])}
                      >
                        <Box>
                          <BsPlus color="gray.500" fontSize={18} />
                        </Box>
                        <Text>
                          {wordExtractor(
                            page?.content?.wordings,
                            "add_other_url_label"
                          )}
                        </Text>
                      </Flex>
                    </GridItem>
                  </Grid>

                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                    }}
                    gap={6}
                    bgColor="#FFF"
                    borderRadius={"15px"}
                    p={6}
                  >
                    <GridItem colSpan={2}>
                      <TitleWrap title={page?.content?.step?.event_images} />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <ImagesComponent />
                    </GridItem>
                  </Grid>

                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                    }}
                    gap={6}
                    bgColor="#FFF"
                    borderRadius={"15px"}
                    p={6}
                  >
                    <GridItem colSpan={2}>
                      <EventBiographySectionEditor
                        page={page}
                        handleSetValue={setValue}
                        register={register("additionalInformation", {
                          required: true,
                        })}
                        errors={errors}
                      />
                    </GridItem>
                  </Grid>

                  <Button
                    colorScheme="yellow"
                    color="black"
                    px={8}
                    py={2}
                    borderRadius="2em"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    {wordExtractor(page?.content?.wordings, "continue_label")}
                  </Button>
                </Flex>
              </Box>

              <Box w={{ base: "100%", md: "310px" }}>
                <Box bgColor={"#FFF"} borderRadius={"15px"} py={6} px={4}>
                  <Box>
                    <Text fontWeight={700} mb={2}>
                      關於活動
                    </Text>
                  </Box>
                  <Divider my={6} />
                  <Box fontSize={"14px"}>
                    <Text fontWeight={700} mb={2}>
                      活動登記
                    </Text>
                    <Flex
                      direction={"row"}
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Text>活動負責人</Text>
                    </Flex>
                    <Flex direction={"row"} justifyContent="space-between">
                      <Text>截止登記日子</Text>
                    </Flex>
                  </Box>

                  {/* <Flex gap={2} direction={"column"} mt={10}>
                    <Button borderRadius="20px" type="submit" w={"100%"}>
                      提交
                    </Button>
                  </Flex> */}
                </Box>
              </Box>
            </Flex>
          </Container>
        </Box>
      </VStack>
    </>
  );
};

const TitleWrap = ({ title }) => (
  <Box w="100%">
    <Text fontSize="20px" letterSpacing="1.5px" fontWeight={600} mt={0} mb={2}>
      {title}
    </Text>
  </Box>
);

export default withPageCMS(EventAdd, {
  key: PAGE_KEY,
  fields: [
    {
      name: "banner",
      label: "頁面橫幅 Hero Banner",
      component: "group",
      fields: [
        {
          label: "右下圖片 Image Right",
          name: "bgImageRight",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
    {
      name: "icon",
      label: "圖示 Icon",
      component: "group",
      fields: [
        {
          label: "工作類型圖標 Employment mode icon",
          name: "modeIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "經驗圖標 Experience icon",
          name: "expIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "地區圖標 Location icon",
          name: "locationIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "時間圖標 Publish Date icon",
          name: "timeIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "申請方法圖標 Apply Methods icon",
          name: "applyMethodsIcon",
          component: "image",
          uploadDir: () => "/job-opportunities",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "filter",
          label: "篩選 Filter Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
              component: "group-list",
              itemProps: ({ id: key, caption: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
