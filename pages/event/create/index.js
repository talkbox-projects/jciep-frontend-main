import React, { useCallback, useState, useRef, useEffect } from "react";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  VStack,
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Stack,
  Flex,
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
import _ from "lodash";
import DividerSimple from "../../../components/DividerSimple";
import wordExtractor from "../../../utils/wordExtractor";
import Container from "../../../components/Container";
import { useAppContext } from "../../../store/AppStore";
import ReactSelect from "react-select";
import { gql } from "graphql-request";
import { getStockPhoto } from "../../../utils/event/getEvent";
import { getGraphQLClient } from "../../../utils/apollo";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import { createEvent } from "../../../utils/event/createEvent";
import { BsPlus } from "react-icons/bs";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props
    },
  };
};

const EventAdd = ({ page }) => {
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
    getValues
  } = useForm({
    defaultValues: {
      otherUrls: [""],
    },
  });
  const additionalFileRefs = useRef(null);
  const [files, setFiles] = useState([]);
  const [stockPhotoId, setStockPhotoId] = useState("");
  const [stockPhoto, setStockPhoto] = useState([]);
  const [step, setStep] = useState("step1");
  const [additionalFileError, setAdditionalFileError] = useState(false);
  const [fileError, setFileError] = useState(false);
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

  useEffect(() => {
    async function getStockPhotoData() {
      const data = (await getStockPhoto()) ?? [];
      setStockPhoto(data)
    }
    getStockPhotoData();
  }, [router]);

  const {
    fields: additionalInformationFields,
    append: additionalInformationAppend,
    remove: additionalInformationRemove,
  } = useFieldArray({ control, name: "additionalInformation" });

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
        {stockPhoto?.map((d) => (
          <GridItem
            borderRadius={"5px"}
            overflow={"hidden"}
            key={d.id}
            onClick={() => {
              const currentStockPhotoId = getValues("stockPhotoId")
              if(currentStockPhotoId === d.id){
                setValue("stockPhotoId", "");
                setStockPhotoId("")
                return;
              }
              setStockPhotoId(d.id);
              setValue("stockPhotoId", d.id);
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
    additionalInformation,
  }) => {
    setAdditionalFileError(false);
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

    if (!_.isEmpty(files)) {
      bannerUploadData = await getGraphQLClient().request(FileUploadmutation, {
        file: files,
      });
    }

    if (!_.isEmpty(additionalInformation)) {
      filesAdditionalInformalUploadData = await additionalInformation
        .map((d) => {
          if (d[0]) {
            return d[0];
          }
        })
        .filter((d) => d);
    } else {
      setAdditionalFileError(true);
      return
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
        banner: {
          file: bannerUploadData?.FileUpload?.[0],
          stockPhotoId: stockPhotoId ?? "",
        },
        additionalInformation:
          filesAdditionalInformalUploadData?.FileUpload.map((d) => d) ?? [],
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
        minHeight={"180px"}
      />
    );
  }, []);

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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "name_label"
                          )}
                          required={true}
                        />
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
                        <LABEL
                          name={page?.content?.form?.type?.label}
                          required={true}
                        />
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
                            <LABEL
                              name={wordExtractor(
                                page?.content?.wordings,
                                "type_other_label"
                              )}
                              required={true}
                            />
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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "description_label"
                          )}
                          required={true}
                        />

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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "start_date_label"
                          )}
                          required={true}
                        />
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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "end_date_label"
                          )}
                          required={true}
                        />
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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "venue_label"
                          )}
                          required={true}
                        />
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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "free_or_charge_label"
                          )}
                          required={true}
                        />

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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "submission_deadline_label"
                          )}
                          required={true}
                        />

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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "contact_number_label"
                          )}
                          required={true}
                        />

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
                          {errors?.submissionDeadline?.type === "required" && (
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
                        <LABEL
                          name={wordExtractor(
                            page?.content?.wordings,
                            "other_url_label"
                          )}
                          required={true}
                        />

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
                      <ImagesComponent />
                    </GridItem>
                  </Grid>

                  <Grid gap={6} bgColor="#FFF" borderRadius={"15px"} p={6}>
                    <GridItem colSpan={2}>
                      <TitleWrap
                        title={wordExtractor(
                          page?.content?.wordings,
                          "more_information_label"
                        )}
                      />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <span className="chakra-text css-tokvmb">*</span>
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
                                onClick={() =>
                                  additionalInformationRemove(index)
                                }
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
                        {additionalFileError && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "input_required"
                          )}
                        </Text>
                      )}
                      </Flex>
                    </GridItem>
                  </Grid>

                  {/* <Grid
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
                          "represent_organization_label"
                        )}
                      />
                    </GridItem>

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
                                          setValue("organizationAdditionalInfo", "")
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
                              {errors?.organizationAdditionalInfo?.type === "required" && (
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
                  </Grid> */}

                  {/* <Button
                    colorScheme="yellow"
                    color="black"
                    px={8}
                    py={2}
                    borderRadius="2em"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    {wordExtractor(page?.content?.wordings, "continue_label")}
                  </Button> */}
                  <Button
                    colorScheme="yellow"
                    color="black"
                    px={8}
                    py={2}
                    borderRadius="2em"
                    type="submit"
                    isLoading={isSubmitting}
                    w={"100%"}
                    maxWidth={"310px"}
                    mx={"auto"}
                  >
                    {wordExtractor(page?.content?.wordings, "submit_label")}
                  </Button>
                </Flex>
              </Box>

              {/* <Box w={{ base: "100%", md: "310px" }}>
                <Box bgColor={"#FFF"} borderRadius={"15px"} py={6} px={4}>
                  <Box>
                    <Text fontWeight={700} mb={2}>
                    {wordExtractor(page?.content?.wordings, "create_event_label")}
                    </Text>
                  </Box>
                  <Divider my={6} />
                  <Button
                    colorScheme="yellow"
                    color="black"
                    px={8}
                    py={2}
                    borderRadius="2em"
                    type="submit"
                    isLoading={isSubmitting}
                    w={'100%'}
                  >
                    {wordExtractor(page?.content?.wordings, "submit_label")}
                  </Button>


                </Box>
              </Box> */}
            </Flex>
          </Container>
        </Box>
      </VStack>
    </>
  );
};

const LABEL = ({ name, required }) => {
  if (!name) {
    return "";
  }

  return (
    <FormLabel {...labelStyles}>
      {name}
      {required && (
        <Text as="span" color="red">
          {" "}
          *
        </Text>
      )}
    </FormLabel>
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
          label: "代表機構 Type Label",
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
