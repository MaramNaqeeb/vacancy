import apiHelpers from "../../support/helpers/apiHelpers";
import Employee from "../../support/projectObject/employee";
import { password, username } from "../../support/helpers/payLoadFunctions";
import * as path from "path";

export let id: any;
export let empId: any;
const employeeObj: Employee = new Employee();
export let vacancyID: any;
export let jobId: any;

let filePath: string = "cypress/fixtures/vacancy.txt";
let vacancyFileName: any = filePath.lastIndexOf("/");
let searchMap: any = {
  "File Name": filePath.slice(vacancyFileName + 1),
  "File Size": "0.01 kb",
  "File Type": "text/plain",
  comment: "",
  Actions: ".oxd-table-cell-actions",
};
before(function () {
  employeeObj.loginFUNC("Admin", "admin123");
  apiHelpers.addEmployee().then((resolve) => {
    empId = `${resolve}`;
    apiHelpers.addEntitlement();
  });

  employeeObj.logout();
});

describe("OrangeHRM-addEmployee and Entitlement-prerequisite", () => {
  beforeEach(function () {
    employeeObj.loginFUNC(username, password);
    apiHelpers.addLeave().then((resolve) => {
      id = `${resolve}`;
      employeeObj.logout();
    });
  });

  it("TCs1: Check leave in the leave grid ", () => {
    employeeObj.loginFUNC("Admin", "admin123");
    apiHelpers.approveLeave(id);
    employeeObj.logout();

    employeeObj.loginFUNC(username, password);
    employeeObj.assertLeave("Scheduled");
  });
});
describe("OrangeHRM-addEmployee and addVacancy-prerequisite", () => {
  beforeEach(function () {
    employeeObj.loginFUNC("Admin", "admin123");
    apiHelpers.addJobTitle().then((resolve) => {
      jobId = `${resolve}`;
      apiHelpers.addVacancy().then((resolve) => {
        vacancyID = `${resolve}`;
      });
    });
  });

  it.only("TCs1: upload vacancy file", () => {
    let filePath: string = "cypress/fixtures/task.xlsx";
    employeeObj.uploadVacancyFile(filePath);
    let xlsxPath: string = "cypress/downloads/task.xlsx";
    const jsonName: string = path.basename(xlsxPath).replace("xlsx", "json");
    employeeObj.downloadFile(xlsxPath, jsonName);
  });
});
