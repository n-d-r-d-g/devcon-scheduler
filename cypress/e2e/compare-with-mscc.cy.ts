import sessionsData from "../../src/data/sessions.json";

describe("compare with MSCC", () => {
  it("checks that MSCC's registration sessions are the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    // Retrieve registration session (same across all conference days)
    cy.get("div.session__wrapper").should("be.visible");
    cy.get("div.session__wrapper > .tile_start").should(
      "contain.text",
      "As from 08:30 — 15:00"
    );
    cy.get("div.session__wrapper > h3").should("contain.text", "Registration");
    cy.get("#day-friday + label").click();
    cy.get("div.session__wrapper").should("be.visible");
    cy.get("div.session__wrapper > .tile_start").should(
      "contain.text",
      "As from 08:30 — 15:00"
    );
    cy.get("div.session__wrapper > h3").should("contain.text", "Registration");
    cy.get("#day-saturday + label").click();
    cy.get("div.session__wrapper").should("be.visible");
    cy.get("div.session__wrapper > .tile_start").should(
      "contain.text",
      "As from 08:30 — 15:00"
    );
    cy.get("div.session__wrapper > h3").should("contain.text", "Registration");
  });

  it("checks that MSCC's session count is the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    // Check Thursday session count
    cy.get(
      '#agenda-thursday a.session__wrapper h3:not(:contains("TBA")):not(:contains("Opening Keynote"))'
    ).should(
      "have.length",
      sessionsData.find((group) => group.groupName === "Thursday")?.sessions
        .length ?? 0
    );
    // Check Friday session count
    cy.get(
      '#agenda-friday a.session__wrapper h3:not(:contains("TBA")):not(:contains("Opening Keynote"))'
    ).should(
      "have.length",
      sessionsData.find((group) => group.groupName === "Friday")?.sessions
        .length ?? 0
    );
    // Check Saturday session count
    cy.get(
      '#agenda-saturday a.session__wrapper h3:not(:contains("TBA")):not(:contains("Opening Keynote"))'
    ).should(
      "have.length",
      sessionsData.find((group) => group.groupName === "Saturday")?.sessions
        .length ?? 0
    );
  });
});
