import { Box } from "@chakra-ui/react";

const DividerTriple = ({
  primaryColor = "#f6d644",
  secondaryColor = "#f6d644",
  nextColor = "#fafafa",
}) => {
  return (
    <Box>
      <svg viewBox="0 0 1367 118">
        <path
          d="M-89.57,13.3S42.93,121.87,209,121.87c109.69,0,171.75-11.82,299.71-40.29C653.81,49.29,790.55,1,937.84,1c110.53,0,351.82,92.9,433.81,92.9,113.73,0,145.78-15.67,145.78-15.67v71.23h-1607Z"
          fill={primaryColor}
          fillRule="evenodd"
        />
        <path
          d="M1393.43,24.86S1324,80.79,1021.31,80.79c-236.59,0-266.11-61.87-433.82-61.87-130.63,0-259.57,91.81-429.83,91.81C61.48,110.73,5.43,58.21,5.43,58.21v92.23h1388Z"
          fill={secondaryColor}
          fillRule="evenodd"
        />
        <path
          d="M-2.57,11.9s113,96.18,254.7,96.18c93.58,0,146.52-10.47,255.69-35.7C631.64,43.78,748.29,1,874,1c94.31,0,300.16,82.3,370.11,82.3,97,0,124.37-13.88,124.37-13.88v348H-2.57Z"
          fill={nextColor}
          fillRule="evenodd"
        />
      </svg>
    </Box>
  );
};

export default DividerTriple;
