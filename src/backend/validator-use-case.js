import { fetchAllValidatorTypes } from "./db/validator-repository";

export const fetchValidationTypes = async () => {
  return await fetchAllValidatorTypes();
};
