import { useForm } from "@tinacms/react-core";
import { useScreenPlugin } from "@tinacms/react-screens";
import { useFormScreenPlugin } from "tinacms";

const withScreenCMS =
  (Component, { key, label, fields, onSubmit }) =>
  (props) => {
    const [data, form] = useForm({
      key,
      label,
      initialValues: {},
      fields,
      onSubmit,
    });
    useFormScreenPlugin(form, "", "screen");

    return <Component {...props} {...{ key: data }} />;
  };
export default withScreenCMS;
