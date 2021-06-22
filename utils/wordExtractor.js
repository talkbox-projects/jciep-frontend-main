const extractor = (data = [], key) => {
  const word = data.find((x) => x.key === key)
  return word? word.value : '';
}

export default extractor;