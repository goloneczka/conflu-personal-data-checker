import { createActiveAdminGroup } from "./db/admin-groups-repository";
import { generateSortableId } from "./db/sortable-id";
import { createValidationType } from "./db/validation-type-repository";

const validators = [
  {
    name: "SSN",
    description: "Detects US Social Security Numbers to help prevent exposure of sensitive government identifiers.",
    active: true,
  },
  {
    name: "Email",
    description: "Finds email addresses to reduce the risk of leaking personal contact information.",
    active: true,
  },
  {
    name: "Phone Number",
    description: "Recognizes phone numbers in international and local formats, helping you avoid sharing private numbers.",
    active: true,
  },
  {
    name: "Credit Card",
    description: "Identifies most popular credit card numbers using standard patterns to protect financial data.",
    active: true,
  },
  {
    name: "IP Address",
    description: "Discovers IPv4 and IPv6 addresses to help prevent exposure of device or network information.",
    active: true,
  },
  {
    name: "Driver’s License",
    description: "Flags driver’s license numbers in various state formats to help prevent exposure of sensitive identification data.",
    active: true,
  },
];

const adminGroups = ["jira-admins", "org-admins", "system-administrators", "site-admins"];

export const initializeStorage = async () => {
  console.log("Initializing storage service...");
  const promises = [];
  for (const validator of validators) {
    promises.push(createValidationType(generateSortableId(), validator));
  }

  for (const group of adminGroups) {
    promises.push(createActiveAdminGroup(generateSortableId(), { name: group, canBeDeleted: false }));
  }

  await Promise.all(promises);
  console.log("All validations & admin groups initialized., promises:", promises.length);
};
