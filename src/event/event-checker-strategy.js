import { bankCardTextChecker } from "./strategy/bank-card-checker";
import { emailTextChecker } from "./strategy/email-checker";
import { SSNTextChecker } from "./strategy/ssn-checker";
import { phoneNumberTextChecker } from "./strategy/phone-number-checker";
import { driverLicenseTextChecker } from "./strategy/driver-license-checker";
import { IpAdressTextChecker } from "./strategy/ip-adress-checker";

export const checkerOption = Object.freeze({
  EMAIL: "email",
  SSN: "ssn",
  BANK_CARD: "bankCard",
  PHONE_NUMBER: "phoneNumber",
  DRIVER_LICENSE: "driverLicense",
  IP_ADDRESS: "ipAddress",
});

const strategyMap = new Map([
  [checkerOption.EMAIL, emailTextChecker],
  [checkerOption.SSN, SSNTextChecker],
  [checkerOption.BANK_CARD, bankCardTextChecker],
  [checkerOption.PHONE_NUMBER, phoneNumberTextChecker],
  [checkerOption.DRIVER_LICENSE, driverLicenseTextChecker],
  [checkerOption.IP_ADDRESS, IpAdressTextChecker],
]);

export async function runCheckersByParams(params, data) {
  const promises = [];
  for (const [key, checker] of strategyMap.entries()) {
    if (params.includes(key)) {
      promises.push(checker(data));
    }
  }
  return Promise.all(promises);
}
