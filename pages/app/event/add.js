import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  Textarea,
  Grid,
  GridItem,
  Checkbox,
  FormHelperText,
  FormLabel,
  Link,
  Flex,
  Image,
  Center,
  Stack,
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement,
  HStack,
  IconButton,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ReactSelect from "react-select";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../store/AppStore";
import { gql } from "graphql-request";
import { getStockPhoto } from "../../../utils/event/getEvent";
import organizationSearch from "../../../utils/api/OrganizationSearch";
import { getGraphQLClient } from "../../../utils/apollo";
import { createEvent } from "../../../utils/event/createEvent";
import { BsPlus } from "react-icons/bs";
import ProfileDropzone from "../../../components/profile/fragments/ProfileDropzone";
import BiographyTypeSelector from "../../../components/profile/fragments/BiographyTypeSelector";
import {
  AiOutlineInfoCircle,
  AiFillMinusCircle,
  AiFillCheckCircle,
  AiOutlineDelete,
} from "react-icons/ai";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";
import { urlRegex } from "../../../utils/general";

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
  const stockPhotos = (await getStockPhoto()) ?? [];

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      stockPhotos,
      api: {
        organizations: await organizationSearch({
          status: ["approved"],
          published: true,
          type: ["ngo"],
        }),
      },
    },
  };
};

const EventAdd = ({ page, stockPhotos, api: { organizations } }) => {
  const { user } = useAppContext();
  const router = useRouter();
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
      otherUrls: [""],
      additionalInformation: [{ file: "", content: "" }],
      representOrganization: "false",
    },
  });
  const additionalFileRefs = useRef(null);
  const [step, setStep] = useState("step1");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [stockPhotoId, setStockPhotoId] = useState("");
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEventImage, setSelectedEventImage] = React.useState(null);
  const watchFields = watch(["type", "freeOrCharge", "representOrganization"], {
    type: [],
    freeOrCharge: "free",
  });
  const getDescriptionCount = watch("description", 0);
  const getDateTimeRemarkCount = watch("datetimeRemark", 0);
  const watchAdditionalInformation = watch("additionalInformation");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherUrls",
  });

  const {
    fields: additionalInformationFields,
    append: additionalInformationAppend,
    remove: additionalInformationRemove,
  } = useFieldArray({ control, name: "additionalInformation" });

  // const {
  //   fields: moreInfoFields,
  //   append: moreInfoAppend,
  //   remove: moreInfoRemove,
  //   insert: moreInfoInsert,
  // } = useFieldArray({ control, name: "moreInfo" });

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
        <Center h={"100%"} fontSize={"14px"} pos={"relative"} zIndex={1} py={4}>
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
        {stockPhotos?.map((d) => (
          <GridItem
            borderRadius={"5px"}
            overflow={"hidden"}
            key={d.id}
            onClick={() => {
              setStockPhotoId(d.id);
              setValue("stockPhotoId", d.id);
              setFiles([]);
            }}
            cursor="pointer"
          >
            <Box
              bgImg={`url('${d?.url}')`}
              w={"100%"}
              h={"75px"}
              bgSize={"cover"}
              border={`3px solid ${stockPhotoId === d.id ? "#F6D644" : "#FFF"}`}
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
    let bannerUploadData, filesAdditionalInformalUploadData;

    const FileUploadmutation = gql`
      mutation FileUpload($file: FileUpload!) {
        FileUpload(files: $file) {
          id
          url
          contentType
          fileSize
        }
      }
    `;

    if (files) {
      bannerUploadData = await getGraphQLClient().request(FileUploadmutation, {
        file: files?.[0],
      });
    }

    if (additionalInformation) {
      filesAdditionalInformalUploadData = await additionalInformation
        .map((d) => {
          if (d[0]) {
            return d[0];
          }
        })
        .filter((d) => d);
    }

    if (filesAdditionalInformalUploadData) {
      filesAdditionalInformalUploadData = await getGraphQLClient().request(
        FileUploadmutation,
        {
          file: filesAdditionalInformalUploadData,
        }
      );
    }

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
        // representOrganization: representOrganization,
        // organizationId: organizationId,
        // organizationAdditionalInfo: organizationAdditionalInfo,
        banner: {
          file: bannerUploadData?.FileUpload?.[0],
          stockPhotoId: stockPhotoId,
        },
        additionalInformation:
          filesAdditionalInformalUploadData?.FileUpload ?? [],
      }).filter(([_, v]) => v != null)
    );

    const response = await createEvent(input);

    if (response?.data) {
      router.push(`/event/create/${response?.data.id}/success`);
    }
  };

  const renderAdditionalImage = useCallback((data) => {
    if (!data) {
      return;
    }
    let url = URL.createObjectURL(data);
    return (
      <Box
        bgImg={`url(${url})`}
        w={"100%"}
        h={"100%"}
        bgSize={"cover"}
        bgPosition={"center center"}
      />
    );
  }, []);

  return (
    <Box pt={{ base: "64px" }}>
      {step === "step1" && (
        <Box>
          <NAV
            title={page?.content?.step?.title}
            // subTitle={page?.content?.step?.subTitle}
            handleClickLeftIcon={() => router.push(`/`)}
          />
          <Box justifyContent="center" width="100%">
            <Box maxWidth={800} width="100%" textAlign="left" margin="auto">
              <VStack
                pt={"16px"}
                as="form"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
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
                        mt={6}
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

                  <GridItem>
                    <FormControl>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "description_label"
                        )}
                      </FormLabel>
                      <Textarea
                        variant="flushed"
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

                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.event} />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem>
                    <FormControl>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "start_date_label"
                        )}
                      </FormLabel>
                      <Stack direction={"row"} align="center">
                        <Input
                          type="date"
                          variant="flushed"
                          placeholder=""
                          {...register("startDate", {
                            required: true,
                          })}
                        />
                      </Stack>

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
                      <Stack direction={"row"} align="center">
                        <Input
                          type="date"
                          variant="flushed"
                          placeholder=""
                          {...register("endDate", {
                            required: true,
                          })}
                        />
                      </Stack>

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

                  <GridItem>
                    <FormControl>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "date_time_remark_label"
                        )}
                      </FormLabel>
                      <Textarea
                        row={4}
                        variant="flushed"
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
                </Grid>

                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.date_time} />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
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
                </Grid>

                <SimpleDivider />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem>
                    <FormControl>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(page?.content?.wordings, "venue_label")}
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

                  <GridItem>
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
                </Grid>

                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.event_registration} />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  {" "}
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
                        {...register("contactNumber", {
                          required: true,
                        })}
                      />
                      <FormHelperText>
                        {errors?.contactNumber?.type === "required" && (
                          <Text color="red">
                            {wordExtractor(
                              page?.content?.wordings,
                              "contact_number_required"
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
                  <GridItem>
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
                              {...register(`otherUrls[${index}]`, {
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
                        {errors?.otherUrls?.[0]?.type === "required" && (
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

                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.event_images} />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem>
                    <ImagesComponent />
                  </GridItem>
                </Grid>

                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.more_information} />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem colSpan={2} rowSpan={2}>
                    {additionalInformationFields.map((item, index) => {
                      return (
                        <Grid
                          key={item.id}
                          templateColumns={{
                            base: "repeat(5, 1fr)",
                          }}
                          gap={6}
                          bgColor="#FFF"
                          borderRadius={"15px"}
                          mb={4}
                          alignItems="center"
                          minH={"200px"}
                        >
                          <GridItem
                            borderRadius={"5px"}
                            overflow={"hidden"}
                            border={"1px solid #EFEFEF"}
                            color={"#666666"}
                            cursor={"pointer"}
                            pos={"relative"}
                            height={`100%`}
                            colSpan={2}
                          >
                            {watchAdditionalInformation[index]?.length > 0 ? (
                              renderAdditionalImage(
                                watchAdditionalInformation[index]?.[0]
                              )
                            ) : (
                              <Box
                                h={"100%"}
                                minHeight={"200px"}
                                cursor="pointer"
                              >
                                <Center
                                  h={"100%"}
                                  fontSize={"14px"}
                                  pos={"relative"}
                                  zIndex={1}
                                >
                                  <Stack
                                    direction="column"
                                    alignItems={"center"}
                                    spacing={2}
                                  >
                                    <BsPlus />
                                    <Text>
                                      {" "}
                                      {wordExtractor(
                                        page?.content?.wordings,
                                        "add_custom_files_label"
                                      )}
                                    </Text>
                                  </Stack>
                                </Center>
                                <Input
                                  type="file"
                                  multiple={false}
                                  opacity={0}
                                  zIndex={2}
                                  top={0}
                                  left={0}
                                  right={0}
                                  bottom={0}
                                  height={"100%"}
                                  position="absolute"
                                  ref={additionalFileRefs}
                                  accept=".pdf, .png, .jpg, .jpeg"
                                  {...register(
                                    `additionalInformation[${index}]`
                                  )}
                                />
                              </Box>
                            )}
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Button
                              colorScheme="red"
                              size="xs"
                              onClick={() => additionalInformationRemove(index)}
                            >
                              {wordExtractor(
                                page?.content?.wordings,
                                "delete_information_label"
                              )}
                            </Button>
                          </GridItem>

                          <GridItem colSpan={5}>
                            <Divider my={2} />
                          </GridItem>
                        </Grid>
                      );
                    })}

                    <Flex>
                      <Button
                        type="button"
                        onClick={() => {
                          additionalInformationAppend({
                            file: "",
                            content: "",
                          });
                        }}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "add_information_label"
                        )}
                      </Button>
                    </Flex>
                  </GridItem>
                </Grid>

                {/* <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem colSpan={2} rowSpan={2}>
                    {additionalInformationFields.map((item, index) => {
                      return (
                        <Grid
                          key={item.id}
                          templateColumns={{
                            base: "repeat(5, 1fr)",
                          }}
                          gap={6}
                          bgColor="#FFF"
                          borderRadius={"15px"}
                          mb={4}
                          alignItems="center"
                          minH={"200px"}
                        >
                          <GridItem
                            borderRadius={"5px"}
                            overflow={"hidden"}
                            border={"1px solid #EFEFEF"}
                            color={"#666666"}
                            cursor={"pointer"}
                            pos={"relative"}
                            height={`100%`}
                            colSpan={4}
                          >
                            {watchAdditionalInformation[index]?.file?.length >
                            0 ? (
                              renderAdditionalImage(
                                watchAdditionalInformation[index]?.file?.[0]
                              )
                            ) : (
                              <Box h={"100%"} minHeight={"120px"}>
                                <Center
                                  h={"100%"}
                                  fontSize={"14px"}
                                  pos={"relative"}
                                  zIndex={1}
                                >
                                  <Stack
                                    direction="column"
                                    alignItems={"center"}
                                    spacing={2}
                                  >
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
                                <Input
                                  type="file"
                                  multiple={false}
                                  opacity={0}
                                  zIndex={2}
                                  top={0}
                                  left={0}
                                  right={0}
                                  bottom={0}
                                  height={"100%"}
                                  position="absolute"
                                  ref={additionalFileRefs}
                                  {...register(
                                    `additionalInformation[${index}].file`
                                  )}
                                />
                              </Box>
                            )}
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Button
                              colorScheme="red"
                              size="xs"
                              onClick={() => additionalInformationRemove(index)}
                            >
                              {wordExtractor(
                                page?.content?.wordings,
                                "delete_information_label"
                              )}
                            </Button>
                          </GridItem>

                          <GridItem colSpan={5}>
                            <Divider my={2} />
                          </GridItem>
                        </Grid>
                      );
                    })}

                    {additionalInformationFields.length === 0 && (
                      <Flex justify="end">
                        <Button
                          type="button"
                          onClick={() => {
                            additionalInformationAppend({
                              file: "",
                              content: "",
                            });
                          }}
                        >
                          {wordExtractor(
                            page?.content?.wordings,
                            "add_information_label"
                          )}
                        </Button>
                      </Flex>
                    )}
                  </GridItem>
                </Grid> */}

                {/* <SimpleDivider />

                <TitleWrap
                  title={wordExtractor(
                    page?.content?.wordings,
                    "represent_organization_label"
                  )}
                />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem colSpan={2}>
                    <FormControl>
                      <Box>
                        <Controller
                          name="representOrganization"
                          isClearable
                          control={control}
                          render={() => (
                            <RadioGroup
                              onChange={(value) =>
                                setValue("representOrganization", value)
                              }
                              defaultValue={"false"}
                            >
                              <Stack direction="column">
                                {page?.content?.form?.representOrganization?.options.map(
                                  ({ label, value }) => (
                                    <Radio
                                      key={label}
                                      value={value}
                                      size="md"
                                      colorScheme={"yellow"}
                                      onChange={() =>
                                        setValue(
                                          "organizationAdditionalInfo",
                                          ""
                                        )
                                      }
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
                    </FormControl>
                    {watchFields[2] === "false" && (
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
                                "organization_addtional_info_title"
                              )}
                            </FormLabel>
                          </FormLabel>
                          <Textarea
                            type="text"
                            variant="flushed"
                            {...register("organizationAdditionalInfo", {
                              required: watchFields[2] === "false",
                            })}
                            row={4}
                          />
                          <FormHelperText>
                            {errors?.organizationAdditionalInfo?.type ===
                              "required" && (
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
                </Grid> */}

                {/* <Grid
                  templateColumns="repeat(3, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <GridItem
                    borderRadius={"5px"}
                    overflow={"hidden"}
                    border={"1px solid #EFEFEF"}
                    color={"#666666"}
                    cursor={"pointer"}
                    pos={"relative"}
                    h={"84px"}
                  >
                    <Center
                      h={"100%"}
                      fontSize={"14px"}
                      pos={"relative"}
                      zIndex={1}
                      onClick={onOpen}
                    >
                      <Stack alignItems={"center"} spacing={2}>
                        <BsPlus />
                        <Text>增加</Text>
                      </Stack>
                    </Center>
                  </GridItem>

                  <GridItem colSpan={3}>
                    <Stack
                      direction="row"
                      fontSize="12px"
                      color="#666666"
                      alignItems="center"
                      spacing={1}
                    >
                      <AiOutlineInfoCircle />
                      <Text>加入照片及更多關於活動的文檔</Text>
                    </Stack>
                  </GridItem>
                </Grid> */}

                <Box
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                    marginTop: "60px",
                  }}
                  h={"16px"}
                  w={"100%"}
                  opacity={0.2}
                />
                <Box px={"15px"} py={"12px"} w="100%">
                  <FormControl textAlign="center">
                    <Button
                      backgroundColor="#F6D644"
                      borderRadius="22px"
                      height="44px"
                      width="100%"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      {page?.content?.continue}
                    </Button>
                  </FormControl>
                </Box>
              </VStack>
            </Box>
            <MoreInformationModal onClose={onClose} />
          </Box>
        </Box>
      )}

      {/* {step === "step2" && (
        <Box>
          <NAV
            title={"代表機構"}
            subTitle={"步驟2/3"}
            handleClickLeftIcon={() => router.push(`/`)}
          />
          <TitleWrap
            title={wordExtractor(
              page?.content?.wordings,
              "represent_organization_label"
            )}
          />
          <Grid
            templateColumns="repeat(1, 1fr)"
            gap={"40px"}
            width="100%"
            px={"15px"}
          >
          </Grid>
          <Box
            style={{
              background:
                "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
              marginTop: "60px",
            }}
            h={"16px"}
            w={"100%"}
            opacity={0.2}
          />
          <Box px={"15px"} py={"12px"} w="100%">
            <FormControl textAlign="center">
              <Button
                backgroundColor="#F6D644"
                borderRadius="22px"
                height="44px"
                width="100%"
              >
                {page?.content?.continue}
              </Button>
            </FormControl>
          </Box>
        </Box>
      )} */}
    </Box>
  );
};

const MoreInformationModal = ({ onClose }) => {
  const [step, setStep] = useState({ step: 1, type: "" });
  const [file, setFile] = useState([]);

  const onFileUpload = async (e) => {
    let uploadedFile = await e.target.files[0];
    if (uploadedFile) {
      setStep(2);
      setFile([uploadedFile]);
    }
  };
  const inputRef = useRef(null);

  const ImagesBox = () => {
    return file?.map((file, index) => {
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

  const Section = ({ currentStep }) => {
    switch (currentStep) {
      case 2:
        return (
          <Box>
            <NAV
              title={"name"}
              handleClickLeftIcon={() => {
                setStep(1);
                setFile([]);
              }}
            />
            <Box bgColor={"#FFF"} p={2}>
              <ImagesBox />
              <Text fontSize="xl" fontWeight={700}>
                資料備註 (選填)
              </Text>
              <Textarea variant="flushed" rows={2} maxLength={250} />
            </Box>
            <Box
              mt={10}
              bgColor="#FFF"
              borderRadius={"15px"}
              textAlign="center"
            >
              確定
            </Box>
          </Box>
        );
      default:
        return (
          <Box>
            <Stack
              direction="column"
              bgColor="#FFF"
              w={"100%"}
              px={2}
              spacing={4}
              borderRadius={"15px"}
              overflow={"hidden"}
            >
              <Flex>
                <Box></Box>
                <Box>相機</Box>
              </Flex>
              <Flex
                onClick={() => {
                  inputRef.current.click();
                }}
              >
                <Box></Box>
                <Box>圖片和影片資料</Box>
                <Input
                  type="file"
                  opacity={0}
                  onChange={(e) => {
                    onFileUpload(e);
                  }}
                  ref={inputRef}
                />
              </Flex>
              <Flex onClick={() => setStep(2)}>
                <Box></Box>
                <Box>文件</Box>
              </Flex>
            </Stack>

            <Box
              mt={10}
              bgColor="#FFF"
              borderRadius={"15px"}
              textAlign="center"
              onClick={onClose}
            >
              取消
            </Box>
          </Box>
        );
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={false} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="transparent" boxShadow={"none"}>
        <ModalBody>
          <Section currentStep={step} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SimpleDivider = () => (
  <Box bgColor="#F3F3F3" h={"8px"} w={"100%"} style={{ margin: "20px 0" }} />
);

const TitleWrap = ({ title }) => (
  <Box w="100%">
    <Text
      fontSize="20px"
      letterSpacing="1.5px"
      fontWeight={600}
      px={"15px"}
      mt={0}
      mb={2}
    >
      {title}
    </Text>
  </Box>
);

const NAV = ({ title, subTitle, handleClickLeftIcon }) => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      width="100%"
      px={"20px"}
      alignItems="center"
      h={"48px"}
      borderBottom="1px solid #EFEFEF"
      mb={"40px"}
    >
      <GridItem>
        <Image
          src={"/images/app/back.svg"}
          alt={""}
          onClick={() => handleClickLeftIcon()}
        />
      </GridItem>
      <GridItem textAlign="center">
        {title && <Text fontWeight={700}>{title}</Text>}
        {subTitle && (
          <Text color="gray.500" fontSize={"12px"}>
            {subTitle}
          </Text>
        )}
      </GridItem>
    </Grid>
  );
};

export default withPageCMS(EventAdd, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "標題 step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "副標題 Sub title",
          component: "text",
        },
        {
          name: "event",
          label: "日子 Sub title",
          component: "text",
        },
        {
          name: "date_time",
          label: "時間 Sub title",
          component: "text",
        },
        {
          name: "event_registration",
          label: "登記 Registration title",
          component: "text",
        },
        {
          name: "event_images",
          label: "圖片 Images title",
          component: "text",
        },
        {
          name: "more_information",
          label: "更多圖片 More Image title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "type",
          label: "活動類別 Type Label",
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
        {
          name: "freeOrCharge",
          label: "費用 Type Label",
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
        {
          name: "representOrganization",
          label: "是否代表機構 Represent Organization Label",
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
    {
      name: "continue",
      label: "繼續標籤 Continue Label",
      component: "text",
    },
  ],
});
