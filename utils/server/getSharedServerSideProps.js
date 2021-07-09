import { getConfiguration } from "../configuration/getConfiguration";

const getSharedServerSideProps = async (context) => {
  const getConfigurations = async (keys) => {
    return await (
      await Promise.all(
        keys.map((key) => getConfiguration({ key, lang: context.locale }))
      )
    ).reduce((_o, configuration, index) => {
      return {
        ..._o,
        [keys[index]]: configuration,
      };
    }, {});
  };

  return {
    props: {
      ...(await getConfigurations([
        "setting",
        "header",
        "footer",
        "navigation",
        "wordings",
      ])),
    },
  };
};

export default getSharedServerSideProps;
