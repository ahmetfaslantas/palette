import "@testing-library/cypress/add-commands";
import "cypress-file-upload";

Cypress.Commands.add("signUpAsInstructor", function() {
  cy.visit("/signup");

  cy.get("[placeholder=\"Name\"]").type(this.auth.instructor.name);
  cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);
  cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.instructor.password);

  cy.contains("Instructor").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/login");
});

Cypress.Commands.add("signUpAsStudent", function() {
  cy.visit("/signup");

  cy.get("[placeholder=\"Name\"]").type(this.auth.student.name);
  cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);
  cy.get("[placeholder=\"Repeat Password\"]").type(this.auth.student.password);

  cy.contains("Student").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/login");
});

Cypress.Commands.add("loginAsInstructor", function() {
  cy.clearCookies();
  cy.visit("/login");

  cy.get("[placeholder=\"Email\"]").type(this.auth.instructor.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.instructor.password);

  cy.contains("Instructor").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("loginAsStudent", function() {
  cy.clearCookies();
  cy.visit("/login");

  cy.get("[placeholder=\"Email\"]").type(this.auth.student.email);
  cy.get("[placeholder=\"Password\"]").type(this.auth.student.password);

  cy.contains("Student").click();

  cy.get("[type=\"submit\"]").click();

  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("createCourse", function() {
  cy.contains("Add Course").click();

  cy.get("[placeholder=\"Course Name\"]").type(this.course.name);
  cy.get("[placeholder=\"Course Description\"]").type(this.course.description);

  cy.contains("Create Course").click();

  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("addStudentToCourse", function() {
  cy.visit("/dashboard");

  cy.findByText("Test Course").click();

  cy.findByText("People").click();

  cy.findByText("Add Student").click();

  cy.get("[placeholder=\"Student Email\"]").type(this.auth.student.email);

  cy.get("button").contains("Add Student").click();

  cy.url().should("include", "/people");
  cy.visit("/");
});

Cypress.Commands.add("createAssignment", function() {
  cy.visit("/dashboard");

  cy.get("[src=\"/./public/assignment.svg\"]").click();

  cy.findByText("Add Assignment").click();

  cy.get("[placeholder=\"Assignment Name\"]").type(this.assignment.title);
  cy.get("[placeholder=\"Assignment Description\"]").type(this.assignment.description);
  cy.get("[placeholder=\"Assignment Due Date\"]").type(this.assignment.dueDate);
  cy.get("[placeholder=\"Max Points\"]").type(this.assignment.maxPoints);
  cy.get("input[type=\"file\"]").attachFile({
    filePath: "testfile.txt",
    mimeType: "text/plain",
  });

  cy.findByText("Create Assignment").click();
});

Cypress.Commands.add("submitAssignment", function() {
  cy.visit("/dashboard");

  cy.findByText("Test Course").click();

  cy.findByText("Assignments").click();

  cy.findByText("Test Assignment").click();

  cy.get("input[type=\"file\"]").attachFile({
    filePath: "testfile.txt",
    mimeType: "text/plain",
  });

  cy.findByText("Submit").click();

  cy.findByText("testfile.txt").should("not.exist");
});