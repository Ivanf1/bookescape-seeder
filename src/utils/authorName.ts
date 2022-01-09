const mapAuthorNameToNameSurname = (fullName: string) => {
  const lastSpaceIdx = fullName.lastIndexOf(" ");
  const name = fullName.substring(0, lastSpaceIdx).trim();
  const surname = fullName.substring(lastSpaceIdx).trim();

  return [name, surname] as const;
};

export default mapAuthorNameToNameSurname;
