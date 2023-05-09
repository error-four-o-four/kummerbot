export const fetchData = async (file) => {
  const data = await fetch(file);
  if (data.ok) {
    return {
      error: null,
      data: await data.text(),
    };
  }

  return {
    error: `Unable to fetch data from ${file}`,
    data: null,
  };
};
