import sessionsData from "../../src/data/sessions.json";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

describe("compare with MSCC", () => {
  it("checks that MSCC's conference dates are the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    cy.get(".days__container > .date").should(
      "have.length",
      Object.keys(sessionsData).length
    );
    cy.get(".days__container > .date").each((date, index) => {
      expect(date.get(0).innerText).to.eq(
        dayjs
          .utc(Object.values(sessionsData)[index].sessions[0].startsAt)
          .format("DD MMMM")
          .toLocaleUpperCase()
      );
    });
    cy.get(".day__selector > .days__container > div").each((day, index) => {
      expect(day.get(0).innerText).to.eq(
        Object.values(sessionsData)[index].groupName.toLocaleUpperCase()
      );
    });
  });

  it("checks that MSCC's registration sessions are the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    // Retrieve registration session (same across all conference days)
    sessionsData.forEach((group) => {
      cy.get(`#day-${group.groupName.toLocaleLowerCase()} + label`).click();
      cy.get("div.session__wrapper").should("be.visible");
      cy.get("div.session__wrapper > .tile_start").should(
        "contain.text",
        "As from 08:30 — 15:00"
      );
      cy.get("div.session__wrapper > h3").should("contain.text", "Registration");
    });
  });

  it("checks that MSCC's session count is the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    sessionsData.forEach((group) => {
      cy.get(
        `#agenda-${group.groupName.toLocaleLowerCase()} a.session__wrapper h3:not(:contains("TBA")):not(:contains("Opening Keynote"))`
      ).should(
        "have.length",
        group.sessions
          .length ?? 0
      );
    });
  });

  it("checks that MSCC's sessions are the same as DevCon Scheduler", () => {
    cy.visit("https://conference.mscc.mu/agenda");

    sessionsData.forEach((group) => {
      const day = group.groupName.toLocaleLowerCase();
      const date = group.sessions[0].startsAt.slice(0, 10);
      const sessionsByDay = sessionsData.find(
        (session) =>
          session.groupName === `${day.charAt(0).toUpperCase()}${day.slice(1)}`
      )?.sessions;
      cy.get(`#agenda-${day} a.session__wrapper`)
        .filter(
          (_index, session) => session.querySelector("h3")?.innerText !== "TBA"
        )
        .each((session, index) => {
          const isOpeningKeynote = index === 0;
          const sessionHTMLElement = session.get(0);

          // Compare id
          expect(session).to.have.attr(
            "href",
            `/agenda/${sessionsByDay?.[index].id}`
          );

          // Compare title
          let title = "";

          if (isOpeningKeynote) {
            const titleParts: Array<string> = [];
            sessionHTMLElement.querySelectorAll("h3").forEach((el, idx) => {
              if (idx === 1) {
                return (titleParts[2] = el.innerText);
              }

              titleParts.push(el.innerText);
            });
            titleParts[1] = `(${sessionHTMLElement
              .querySelector(".sponsor-logo img")
              ?.getAttribute("src")
              ?.split("/")
              .at(-1)
              ?.split(".")[0]
              .split("-")
              .join("|")})`;
            title = `${titleParts[0]} ${titleParts[1]}: ${titleParts[2]}`;
          } else {
            title = sessionHTMLElement.querySelector("h3")?.innerText ?? "";
          }
          expect(title.toLocaleUpperCase()).to.eq(
            sessionsByDay?.[index].title.toLocaleUpperCase()
          );

          const sessionScheduleParts =
            sessionHTMLElement.querySelector("div")?.innerText.split(" - ") ??
            [];

          // Compare startsAt
          const sessionStartsAt = `${date}T${sessionScheduleParts[0].trim()}:00`;
          expect(sessionStartsAt).to.eq(sessionsByDay?.[index].startsAt);

          // Compare endsAt
          const sessionEndsAt = `${date}T${sessionScheduleParts[1].trim()}:00`;
          expect(sessionEndsAt).to.eq(sessionsByDay?.[index].endsAt);

          // Compare speakers
          const sessionSpeakers = [
            ...sessionHTMLElement.querySelectorAll(".speaker--headshot > div"),
          ]
            .map((speakerEl) => (speakerEl as HTMLElement).innerText)
            .join(", ");
          expect(sessionSpeakers).to.eq(
            sessionsByDay?.[index].speakers
              .map((speaker) => speaker.name)
              .join(", ")
          );

          // Compare room
          expect(session).to.have.attr(
            "data-room",
            // There's a typo on MSCC's website - Accelarator instead of Accelerator
            sessionsByDay?.[index].room === "Accelerator"
              ? "Accelarator"
              : sessionsByDay?.[index].room
          );
        });
    });
  });
});
