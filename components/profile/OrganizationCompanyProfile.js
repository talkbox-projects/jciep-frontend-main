const CompanyProfile = ({ organization, page, enums, editable }) => {
  const props = { organization, page, enums, editable };

  return (
    <VStack>
      <CompanySection {...props} />
      <BiographySection {...props} />
      <PortfolioSection {...props} />
    </VStack>
  );
};

export default CompanyProfile;
