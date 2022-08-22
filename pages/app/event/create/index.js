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
  FormHelperText,
  FormLabel,
  Flex,
  Center,
  Stack,
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ReactSelect from "react-select";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../../store/AppStore";
import { gql } from "graphql-request";
import { getStockPhoto } from "../../../../utils/event/getEvent";
import { getGraphQLClient } from "../../../../utils/apollo";
import { createEvent } from "../../../../utils/event/createEvent";
import { BsPlus } from "react-icons/bs";
import { urlRegex, phoneRegex } from "../../../../utils/general";
import {
  AiOutlineInfoCircle,
  AiFillMinusCircle,
  AiOutlineFilePdf,
  AiOutlinePlayCircle,
} from "react-icons/ai";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../utils/wordExtractor";

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
      isApp: true,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
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
    getValues,
  } = useForm({
    defaultValues: {
      otherUrls: [""],
      additionalInformation: [{}],
      bannerImage: [{}],
      representOrganization: "false",
    },
  });
  const [step, setStep] = useState("step1");
  const [stockPhotoId, setStockPhotoId] = useState("");
  const [debugResult, setDebugResult] = useState("");
  const [pickImageDebugResult, setPickImageDebugResult] = useState("");
  const [stockPhoto, setStockPhoto] = useState([]);
  const [bannerFileError, setBannerFileError] = useState(false);
  const [additionalFileError, setAdditionalFileError] = useState(false);
  const watchFields = watch(["type", "freeOrCharge", "representOrganization"], {
    type: [],
    freeOrCharge: "free",
  });
  const getDescriptionCount = watch("description", 0);
  const getDateTimeRemarkCount = watch("datetimeRemark", 0);
  const watchAdditionalInformation = watch("additionalInformation");
  const watchBannerImage = watch("bannerImage");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherUrls",
  });

  const {
    fields: additionalInformationFields,
    append: additionalInformationAppend,
    remove: additionalInformationRemove,
  } = useFieldArray({ control, name: "additionalInformation" });

  const {
    fields: bannerField,
    append: bannerAppend,
    remove: bannerRemove,
  } = useFieldArray({ control, name: "bannerImage" });

  useEffect(() => {
    async function getStockPhotoData() {
      const data = (await getStockPhoto()) ?? [];
      setStockPhoto(data);
    }
    getStockPhotoData();

    // setValue("additionalInformation", [
    //   {
    //     "id": "62f6091882cd2e001b093096",
    //     "url": "/api/assets/files/GP0OLY_Web_size.jpg",
    //     "contentType": "application/pdf",
    //     "fileSize": 23446
    //   },
    //   {
    //     "id": "62f6091e82cd2e001b09309c",
    //     "url": "/api/assets/files/Black_Closed.png",
    //     "contentType": "video/mp4",
    //     "fileSize": 17798
    //   }
    // ]);
  }, [router]);

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

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handlePickFile = (fieldName, index) => {
    window.WebContext = {};
    window.WebContext.pickFileHandler = async (response) => {
      const fileInfo = JSON.parse(response);
      if (!fileInfo.result) {
        setDebugResult(
          JSON.stringify(
            {
              status: "response not found",
            },
            null,
            4
          )
        );
      } else {
        let file = dataURLtoFile(
          fileInfo.result?.data[0]?.data,
          fileInfo.result?.data[0]?.name
        );
        let bannerUploadData;

        if (file) {
          bannerUploadData = await getGraphQLClient().request(
            FileUploadmutation,
            {
              file: file,
            }
          );

          if (fieldName === "bannerImage") {
            setValue(fieldName, [bannerUploadData?.FileUpload?.[0]]);
          } else {
            let updateData = watchAdditionalInformation;

            updateData[index] = bannerUploadData?.FileUpload?.[0];
            setValue(fieldName, updateData);
          }
        }
      }
    };

    let json = {
      name: "pickFile",
      options: {
        callback: "pickFileHandler",
        params: {
          maxFileSize: 4194304,
          maxFileCount: 1,
          minFileCount: 1,
          mimeType: fieldName === "bannerImage" ? "image/*" : "*/*",
          supportCrop: true,
        },
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

  const renderPickedImage = useCallback((data, fieldName, index) => {
    if (!data) {
      return;
    }

    if (data?.contentType === "application/pdf") {
      return (
        <Box
          bgColor="#F2F2F2"
          h={"100%"}
          w={"100%"}
          bgSize={{ base: "cover" }}
          bgPosition={"center center"}
          position={"relative"}
        >
          <Center h={"100%"}>
            <AiOutlineFilePdf style={{ width: "30px", height: "30px" }} />
          </Center>
        </Box>
      );
    }

    if (data?.contentType === "video/mp4") {
      return (
        <Box
          bgColor="#F2F2F2"
          h={"100%"}
          w={"100%"}
          bgSize={{ base: "cover" }}
          bgPosition={"center center"}
          position={"relative"}
        >
          <Center h={"100%"}>
            <AiOutlinePlayCircle style={{ width: "30px", height: "30px" }} />
          </Center>
        </Box>
      );
    }

    return (
      <Box
        bgImg={`url(${data?.url})`}
        w={"100%"}
        h={"100%"}
        bgSize={"cover"}
        bgPosition={"center center"}
        onClick={() => handlePickFile(fieldName, index)}
      />
    );
  }, []);

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
    stockPhotoId,
    otherUrls,
    remark,
    additionalInformation,
    bannerImage,
  }) => {
    setAdditionalFileError("");
    setBannerFileError("");

    if (_.isEmpty(bannerImage?.[0]) && _.isEmpty(stockPhotoId)) {
      setBannerFileError(
        wordExtractor(page?.content?.wordings, "submission_deadline_required")
      );
      return;
    }

    // if (!_.isEmpty(additionalInformation?.[0]?.[0]?.name)) {
    //   filesAdditionalInformalUploadData = await additionalInformation
    //     .map((d) => {
    //       if (d[0]) {
    //         return d[0];
    //       }
    //     })
    //     .filter((d) => d);
    // }

    // if (filesAdditionalInformalUploadData) {
    //   filesAdditionalInformalUploadData = await getGraphQLClient().request(
    //     FileUploadmutation,
    //     {
    //       file: filesAdditionalInformalUploadData,
    //     }
    //   );
    // }

    const submitBanner = bannerImage?.[0]
      ? {
          file: bannerImage?.[0],
        }
      : {
          stockPhotoId: stockPhotoId,
        };
    const input = Object.fromEntries(
      Object.entries({
        name: name,
        type: type?.value,
        typeOther: type?.value === "other" ? typeOther : "",
        description: description,
        startDate: startDate,
        endDate: endDate,
        startTime: _.isEmpty(startTime) ? "00:00" : startTime,
        endTime: _.isEmpty(endTime) ? "00:00" : endTime,
        datetimeRemark: datetimeRemark,
        quota: quota,
        venue: venue,
        location: location,
        freeOrCharge: freeOrCharge,
        price: price,
        submissionDeadline: submissionDeadline,
        eventManager: eventManager,
        contactNumber: contactNumber,
        registerUrl: registerUrl ? registerUrl.toLowerCase() : "",
        otherUrls: !_.isEmpty(otherUrls) ? otherUrls.map(d=> d?.toLowerCase()) : [],
        remark: remark,
        banner: submitBanner,
        additionalInformation: additionalInformation ?? [],
        stockPhotoId: null,
      }).filter(([_, v]) => v != null)
    );

    const response = await createEvent(input);

    // For iOS mobile debug

    if (!response?.error) {
      router.push(`/app/event/create/${response?.data.id}/success`);
    } else {
      setDebugResult(JSON.stringify(response));
    }
  };

  return (
    <Box pt={{ base: "64px" }}>
      {step === "step1" && (
        <Box>
          <NAV title={page?.content?.step?.title} />
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
                            isSearchable={false}
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
                      <LABEL
                        name={wordExtractor(
                          page?.content?.wordings,
                          "description_label"
                        )}
                        required={true}
                      />
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
                      <LABEL
                        name={wordExtractor(
                          page?.content?.wordings,
                          "start_date_label"
                        )}
                        required={true}
                      />
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
                      <LABEL
                        name={wordExtractor(
                          page?.content?.wordings,
                          "end_date_label"
                        )}
                        required={true}
                      />
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

                  <GridItem>
                    <FormControl>
                      <LABEL
                        name={wordExtractor(
                          page?.content?.wordings,
                          "quota_label"
                        )}
                        required={true}
                      />
                      <Input
                        type="text"
                        variant="flushed"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "quota_placeholder"
                        )}
                        {...register("quota", {
                          required: true,
                        })}
                      />
                      <FormHelperText>
                        {errors?.quota?.type === "required" && (
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
                      <LABEL
                        name={wordExtractor(
                          page?.content?.wordings,
                          "event_manager_label"
                        )}
                        required={true}
                      />
                      <Input
                        type="text"
                        variant="flushed"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "event_manager_placeholder"
                        )}
                        {...register("eventManager", {
                          required: true,
                        })}
                      />
                      <FormHelperText>
                        {errors?.eventManager?.type === "required" && (
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
                          pattern: {
                            value: phoneRegex,
                            message: wordExtractor(
                              page?.content?.wordings,
                              "field_error_message_invalid_url"
                            ),
                          },
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
                      <FormHelperText color="red">
                        {errors?.contactNumber?.message}
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isInvalid={errors?.registerUrl?.message}>
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
                        {...register("registerUrl", {
                          pattern: {
                            value: urlRegex,
                            message: wordExtractor(
                              page?.content?.wordings,
                              "field_error_message_invalid_url"
                            ),
                          },
                        })}
                      />
                      <FormHelperText color="red">
                        {errors?.registerUrl?.message}
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem>
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
                                pattern: {
                                  value: urlRegex,
                                  message: wordExtractor(
                                    page?.content?.wordings,
                                    "field_error_message_invalid_url"
                                  ),
                                },
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

                        {errors?.otherUrls?.length > 0 && (
                          errors?.otherUrls?.map((d,i) => <Text key={i} color="red">
                            {wordExtractor(
                              page?.content?.wordings,
                              "field_error_message_invalid_url"
                            )}
                          </Text>)
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

                <TitleWrap
                  title={page?.content?.step?.event_images}
                  required={true}
                />

                <Grid
                  templateColumns="repeat(1, 1fr)"
                  gap={"40px"}
                  width="100%"
                  px={"15px"}
                >
                  <Grid
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    }}
                    gap={"20px"}
                    width="100%"
                  >
                    {stockPhoto?.map((d) => (
                      <GridItem
                        borderRadius={"5px"}
                        overflow={"hidden"}
                        key={d.id}
                        onClick={() => {
                          const currentStockPhotoId = getValues("stockPhotoId");
                          if (currentStockPhotoId === d.id) {
                            setValue("stockPhotoId", "");
                            setStockPhotoId("");
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
                          border={`3px solid ${
                            stockPhotoId === d.id ? "#F6D644" : "#FFF"
                          }`}
                        />
                      </GridItem>
                    ))}

                    {bannerField.map((item, index) => {
                      return (
                        <Grid key={item.id} bgColor="#FFF" alignItems="center">
                          <GridItem
                            overflow={"hidden"}
                            border={"1px solid #EFEFEF"}
                            color={"#666666"}
                            cursor={"pointer"}
                            pos={"relative"}
                            height={`100%`}
                            margin="0 2px"
                          >
                            {watchBannerImage[index] && (
                              <Button
                                colorScheme="red"
                                size="xs"
                                onClick={() => {
                                  bannerRemove(index);
                                  setTimeout(() => {
                                    bannerAppend({});
                                  }, 200);
                                }}
                                position="absolute"
                                top={2}
                                right={2}
                              >
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "delete_information_label"
                                )}
                              </Button>
                            )}
                            {!_.isEmpty(watchBannerImage[index]) ? (
                              renderPickedImage(
                                watchBannerImage[index],
                                "bannerImage"
                              )
                            ) : (
                              <Box
                                h={"100%"}
                                minHeight={"74px"}
                                cursor="pointer"
                                onClick={() => handlePickFile("bannerImage")}
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
                                        "add_custom_file_label"
                                      )}
                                    </Text>
                                  </Stack>
                                </Center>
                              </Box>
                            )}
                          </GridItem>
                        </Grid>
                      );
                    })}

                    {bannerFileError && (
                      <FormControl>
                        <FormHelperText>
                          <Text color="red">{bannerFileError}</Text>
                        </FormHelperText>
                      </FormControl>
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
                </Grid>
                <SimpleDivider />

                <TitleWrap title={page?.content?.step?.more_information} />

                <Box width="100%">
                  {additionalInformationFields.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        borderRadius={"5px"}
                        overflow={"hidden"}
                        border={"1px solid #EFEFEF"}
                        color={"#666666"}
                        cursor={"pointer"}
                        pos={"relative"}
                        colSpan={4}
                        h={{ base: "240px", md: "320px" }}
                        m={2}
                        className="additionalInformationWrap"
                      >
                        {/* {watchAdditionalInformation[index]?.[0] && (
                          <Button
                            colorScheme="red"
                            size="xs"
                            onClick={() => additionalInformationRemove(index)}
                            position="absolute"
                            top={2}
                            right={2}
                          >
                            {wordExtractor(
                              page?.content?.wordings,
                              "delete_information_label"
                            )}
                          </Button>
                        )} */}
                        {watchAdditionalInformation[index] ? (
                          <Box pos="relative" h={"100%"}>
                            <Box
                              h={"100%"}
                              minHeight={"200px"}
                              width="100%"
                              cursor="pointer"
                              position="absolute"
                              opacity={0}
                              zIndex={3}
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
                              {/* <Input
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
                                onInput={(e) =>
                                  onAdditionalFileUpload(e, index)
                                }
                                accept=".pdf, .png, .jpg, .jpeg"
                                {...register(`additionalInformation[${index}]`)}
                              /> */}
                            </Box>
                            <Box pos="relative" zIndex={4} h={"100%"}>
                              {renderPickedImage(
                                watchAdditionalInformation[index],
                                "additionalInformation",
                                index
                              )}
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            h={"100%"}
                            minHeight={"200px"}
                            width="100%"
                            cursor="pointer"
                            pos="relative"
                            onClick={() =>
                              handlePickFile("additionalInformation", index)
                            }
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
                            {/* <Input
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
                              onInput={(e) => onAdditionalFileUpload(e, index)}
                              accept=".pdf, .png, .jpg, .jpeg"
                              {...register(`additionalInformation[${index}]`)}
                            /> */}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  {/* {additionalFileError && (
                    <Text color="red" mx={2}>
                      {additionalFileError}
                    </Text>
                  )} */}
                  <Flex m={2}>
                    <Button
                      type="button"
                      onClick={() => {
                        additionalInformationAppend({});
                      }}
                    >
                      {wordExtractor(
                        page?.content?.wordings,
                        "add_information_label"
                      )}
                    </Button>
                  </Flex>
                </Box>
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
                {/* <Box>
                  debug:
                  {debugResult && (
                    <Box
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                      maxWidth={"300px"}
                    >
                      {debugResult}
                    </Box>
                  )}
                </Box> */}

                <Box>
                  {pickImageDebugResult && (
                    <Box
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                      maxWidth={"360px"}
                    >
                      {pickImageDebugResult}
                    </Box>
                  )}
                </Box>
              </VStack>
            </Box>
            {/* <MoreInformationModal onClose={onClose} /> */}
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

// const MoreInformationModal = ({ onClose }) => {
//   const [step, setStep] = useState({ step: 1, type: "" });
//   const [file, setFile] = useState([]);

//   const onFileUpload = async (e) => {
//     let uploadedFile = await e.target.files[0];
//     if (uploadedFile) {
//       setStep(2);
//       setFile([uploadedFile]);
//     }
//   };
//   const inputRef = useRef(null);

//   const ImagesBox = () => {
//     return file?.map((file, index) => {
//       let url = URL.createObjectURL(file);
//       return (
//         <GridItem
//           borderRadius={"5px"}
//           overflow={"hidden"}
//           key={url + index}
//           border="2px solid #007878"
//           pos="relative"
//           cursor="pointer"
//         >
//           <Box
//             bgImg={`url(${url})`}
//             w={"100%"}
//             h={"75px"}
//             bgSize={"cover"}
//             bgPosition={"center center"}
//           />
//         </GridItem>
//       );
//     });
//   };

//   const Section = ({ currentStep }) => {
//     switch (currentStep) {
//       case 2:
//         return (
//           <Box>
//             <NAV
//               title={"name"}
//               handleClickLeftIcon={() => {
//                 setStep(1);
//                 setFile([]);
//               }}
//             />
//             <Box bgColor={"#FFF"} p={2}>
//               <ImagesBox />
//               <Text fontSize="xl" fontWeight={700}>
//                 資料備註 (選填)
//               </Text>
//               <Textarea variant="flushed" rows={2} maxLength={250} />
//             </Box>
//             <Box
//               mt={10}
//               bgColor="#FFF"
//               borderRadius={"15px"}
//               textAlign="center"
//             >
//               確定
//             </Box>
//           </Box>
//         );
//       default:
//         return (
//           <Box>
//             <Stack
//               direction="column"
//               bgColor="#FFF"
//               w={"100%"}
//               px={2}
//               spacing={4}
//               borderRadius={"15px"}
//               overflow={"hidden"}
//             >
//               <Flex>
//                 <Box></Box>
//                 <Box>相機</Box>
//               </Flex>
//               <Flex
//                 onClick={() => {
//                   inputRef.current.click();
//                 }}
//               >
//                 <Box></Box>
//                 <Box>圖片和影片資料</Box>
//                 <Input
//                   type="file"
//                   opacity={0}
//                   onChange={(e) => {
//                     onFileUpload(e);
//                   }}
//                   ref={inputRef}
//                 />
//               </Flex>
//               <Flex onClick={() => setStep(2)}>
//                 <Box></Box>
//                 <Box>文件</Box>
//               </Flex>
//             </Stack>

//             <Box
//               mt={10}
//               bgColor="#FFF"
//               borderRadius={"15px"}
//               textAlign="center"
//               onClick={onClose}
//             >
//               取消
//             </Box>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Modal blockScrollOnMount={false} isOpen={false} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent bgColor="transparent" boxShadow={"none"}>
//         <ModalBody>
//           <Section currentStep={step} />
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

const SimpleDivider = () => (
  <Box bgColor="#F3F3F3" h={"8px"} w={"100%"} style={{ margin: "20px 0" }} />
);

const TitleWrap = ({ title, required = false }) => (
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
      {required && (
        <sup className="chakra-text css-tokvmb" style={{ color: "red" }}>
          *
        </sup>
      )}
    </Text>
  </Box>
);

const NAV = ({ title, subTitle }) => {
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
      <GridItem></GridItem>
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
