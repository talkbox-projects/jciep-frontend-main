import EmployerSection from "./sections/EmployerSection";

const IdentityEmployerProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <VStack align="stretch">
      <EmployerSection {...props} />
    </VStack>
  );
};

export default IdentityEmployerProfile;
