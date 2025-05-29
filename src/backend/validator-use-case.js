import { fetchAllValidatorTypes } from "./db/validator-repository";

export const fetchValidationTypes = async () => {
  const dbData = await fetchAllValidatorTypes();
  return dbData.results.map((item) => ({
    ...item.value,
    id: item.key,
  }));
};
