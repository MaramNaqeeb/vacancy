import { vacancyID } from "../../e2e/OrangeHRM/addEmployee.spec.cy";

class Employee {
  elements = {
    userName: () => cy.getByCy("Username"),
    password: () => cy.getByCy("Password"),
    loginBTN: () => cy.get("[type=submit]"),
    logoutDropdown: () => cy.get(".oxd-userdropdown-tab"),
    logoutBtn: () => cy.contains("Logout"),
    addFileBtn: () => cy.get(".orangehrm-header-container > .oxd-button"),
    uploadFile: () => cy.get('input[type="file"]'),
    saveBtn: () => cy.get(".oxd-form-actions").eq(1).contains("Save"),
    downloadIcon: () =>
      cy.get(".oxd-table-cell-actions > :nth-child(2) > .oxd-icon"),
    loadingSpinner: () => cy.get(".oxd-loading-spinner"),
    assertAttachment: () => cy.get(".oxd-table-cell.oxd-padding-cell"),
    tableRow: () => cy.get(".oxd-table-card"),
  };

  loginFUNC(userName: string, password: string) {
    cy.visit("/");

    this.elements.userName().type(userName),
      this.elements.password().type(password),
      this.elements.loginBTN().click({ force: true });
  }
  
  logout() {
    this.elements.logoutDropdown().click();
    this.elements.logoutBtn().click({ multiple: true });
  }

  uploadVacancyFile(filePath: string) {
    cy.visit(
      `https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addJobVacancy/${vacancyID}`
    );
    this.elements.loadingSpinner().should("not.exist");
    this.elements.addFileBtn().click();
    this.elements.uploadFile().selectFile(filePath, { force: true });
    this.elements.saveBtn().click();
  }
  downloadFile(xlsxPath: string, jsonName: string) {
    this.elements.downloadIcon().click();
    cy.wait(2000);
    cy.task("convertXlsxToJson", xlsxPath);
    cy.fixture(jsonName).as("userInfo");
    cy.log(jsonName);
    cy.get("@userInfo")
      .should("have.length", 1)
      .then((userInfo) => {
        expect(userInfo[0]['task1']).to.equal("reading");
      });
  }
  assertVacancyUploadedFile(
    tableSelector: string,
    rowSelector: string,
    searchMap: any
  ) {
    cy.get(tableSelector)
      .find(rowSelector)
      .filter(`:contains(${searchMap})`)
      .should("exist");
  }
  assertLeave(status: any) {
    cy.visit("/web/index.php/leave/viewMyLeaveList");

    this.elements.loadingSpinner().should("not.exist");
    this.elements.tableRow().should("have.length", 1);
    this.elements.assertAttachment().eq(6).should("contain", status);
  }
}

export default Employee;
