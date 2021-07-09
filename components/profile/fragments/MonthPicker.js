import { HStack, VStack, Select, Text, Checkbox } from "@chakra-ui/react";
import moment from "moment";
import { forwardRef, useCallback, useMemo, useState } from "react";

const MonthPicker = ({ value, onChange }) => {
  const [dateString, setDateString] = useState(
    !value ? "-/-" : moment(value).format("MM/yyyy")
  );
  const [month, year] = useMemo(() => {
    return dateString.split("/");
  }, [dateString]);

  const onMonthChange = useCallback(
    (month) => {
      setDateString(`${month}/${year}`);
      if (year !== "-" && month !== "-") {
        onChange(moment(`${month}/${year}`, "MM/yyyy").valueOf());
      } else {
        onChange(null);
      }
    },
    [year]
  );
  const onYearChange = useCallback(
    (year) => {
      setDateString(`${month}/${year}`);
      if (year !== "-" && month !== "-") {
        onChange(moment(`${month}/${year}`, "MM/yyyy").valueOf());
      } else {
        onChange(null);
      }
    },
    [month]
  );
  //   console.log(
  //     "value=",
  //     value,
  //     " dateString=",
  //     dateString,
  //     " year=",
  //     year,
  //     " month=",
  //     month
  //   );
  return (
    <HStack w="100%" align="start">
      <Select
        placeholder=""
        variant="flushed"
        size="sm"
        flex={1}
        minW={0}
        w="100%"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="-">-</option>
        {[...Array(80).keys()].map((x) => {
          const year = x + new Date().getFullYear() - 40;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </Select>
      <Text>/</Text>
      <Select
        flex={1}
        minW={0}
        w="100%"
        variant="flushed"
        size="sm"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        <option value="-">-</option>
        {[...Array(12).keys()].map((x) => {
          const month = (x + 1).toString().padStart(2, "0");
          return (
            <option key={month} value={month}>
              {month}
            </option>
          );
        })}
      </Select>
    </HStack>
  );
};

export default MonthPicker;
