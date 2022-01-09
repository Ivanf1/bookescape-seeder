const getBookImagePath = (originalPath: string): string => {
  const baseUrl = originalPath.split("/?")[0];
  const imageId = baseUrl.split("img/")[1];
  return imageId;
};

export default getBookImagePath;
