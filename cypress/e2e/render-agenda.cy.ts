import sessionsData from "../../src/data/sessions.json";
import roomsData from "../../src/data/rooms.json";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

describe(
  "render agenda",
  {
    env: {
      baseDevConSchedulerUrl: "http://localhost:3000",
    },
  },
  () => {
    it("checks that the correct agenda days & dates are displayed in the tabs", () => {
      cy.visit(Cypress.env("baseDevConSchedulerUrl"));

      cy.get('[role="group"] > button').each((el, index) => {
        const spans = el.get(0).querySelectorAll("span");

        expect(spans[0].innerText).to.eq(
          Object.values(sessionsData)[index].groupName.slice(0, 3)
        );
        expect(spans[1].innerText).to.eq(
          Object.values(sessionsData)[index].groupName
        );
        expect(spans[2].innerText).to.eq(
          dayjs
            .utc(Object.values(sessionsData)[index].sessions[0].startsAt)
            .format("DD/MM")
        );
      });
    });

    it("checks that all rooms are displayed", () => {
      cy.visit(Cypress.env("baseDevConSchedulerUrl"));

      cy.get('[data-testid="sidebar"] > div').should(
        "have.length",
        roomsData.length
      );
      cy.get('[data-testid="sidebar"] > div > p').each((room, index) => {
        expect(room.get(0).innerText, roomsData[index].name);
      });
    });

    it("checks that all sessions from the json are on screen & session information is correct", () => {
      cy.visit(Cypress.env("baseDevConSchedulerUrl"));
      cy.viewport(3100, 912);

      cy.get('[role="group"] > button').each((dayButton, index) => {
        cy.wrap(dayButton).click();

        cy.get('[data-testid="content"] > div').should(
          "have.length",
          Object.values(sessionsData)[index].sessions.length + 1
        );
      });
    });
  }
);
