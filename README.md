# DevCon Scheduler

## Motivation

The MSCC Developers Conference has an awesome agenda that showcases all of its sessions. One issue though is attendees can't save sessions they're interested in attending, which can be an inconvenience at the conference as they need to check the whole agenda just to find out details about the next session.

## Steps

So, I wrote a script to give the ability to choose sessions you want to attend.

![image](https://github.com/user-attachments/assets/f8118d93-d167-4e12-9715-e52754724dea)

1. Navigate to [MSCC Developers Conference agenda](https://conference.mscc.mu/agenda) then run the following script in your web browser's console to get the option to add/remove sessions.
```js
function setStyles() {
    const styles = `
        .session-toggler {
            padding-inline: 1.5rem;
            padding-block: 0.5rem;
            margin-block-start: 0.5rem;
            border-radius: 0.25rem;
            border-width: 1px;
            border-style: solid;
            border-color: #424242;
            transition: all ease 0.2s;
        }

        .session-toggler[data-status="removed"]:hover {
            color: #0e600e;
            background-color: #edffed;
            border-color: #0e600e;
        }

        .session-toggler[data-status="removed"]:focus-visible {
            color: white;
            background-color: #0e600e;
            border-color: #0e600e;
        }

        .session-toggler[data-status="added"] {
            color: white;
            background-color: #0e600e;
            border-color: #0e600e;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function getRooms() {
    const rooms = []
    document.querySelectorAll("#rooms-bar > .track__title").forEach(room => rooms.push(room.textContent.trim()));

    return rooms;
}

function injectToggleButtons() {
    document.querySelectorAll('a.session__wrapper').forEach(session => {
        const toggleBtn = document.createElement("button");

        toggleBtn.appendChild(document.createTextNode("Add"));
        toggleBtn.dataset["status"] = "removed";
        toggleBtn.dataset["day"] = session.parentElement.parentElement.id.replace("agenda-", "");
        toggleBtn.dataset["time"] = session.querySelector(".tile_start").textContent.trim();
        toggleBtn.dataset["title"] = session.querySelector("h3").textContent.trim();
        toggleBtn.dataset["authors"] = session.querySelector(".speaker").textContent.trim().replace(/\s\s+/g, ', ');
        toggleBtn.dataset["room"] = session.dataset.room;
        toggleBtn.type = "button"
        toggleBtn.classList.add("session-toggler");

        toggleBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            const currentStatus = toggleBtn.dataset["status"];
            const newStatus = currentStatus === "removed" ? "added" : "removed";
            toggleBtn.dataset["status"] = newStatus;
            toggleBtn.textContent = newStatus === "added" ? "Added" : "Add";
        }

        session.appendChild(toggleBtn);
    });
}

function getAddedSessionsByDay() {
    const addedSessions = {};
    const addedSessionBtns = document.querySelectorAll(".session-toggler[data-status='added']");

    addedSessionBtns.forEach(btn => {
        const day = btn.dataset["day"];
        addedSessions[day] = [
            ...(addedSessions[day] ?? []),
            {
                time: btn.dataset["time"],
                title: btn.dataset["title"],
                authors: btn.dataset["authors"],
                room: btn.dataset["room"],
            }
        ];
    });

    return addedSessions;
}

function print() {
    const addedSessions = getAddedSessionsByDay();
    const horizontalSeparator = "================="
    const formattedSessions = Object.entries(addedSessions).reduce((prevDisplay, [day, sessions], dayIndex) => {
        let nextDisplay = dayIndex === 0 ? "" : `${prevDisplay}\n\n\n\n`;
        nextDisplay += `${horizontalSeparator}\n${day.toUpperCase()}:\n${horizontalSeparator}`;

        sessions.forEach(session => {
            nextDisplay += `\n\n`;
            nextDisplay += `Title: ${session.title}\n`;
            nextDisplay += `Time: ${session.time}\n`;
            nextDisplay += `Room: ${session.room}\n`;
            nextDisplay += `Author(s): ${session.authors || "N/A"}`;
        })
        
        return nextDisplay;
    }, '');

    console.log(formattedSessions);
}

setStyles();
injectToggleButtons();
```

2. Once you're done adding sessions, run the following command to get a list of sessions you've chosen to attend.

```js
print();
```

3. If you want to, you can copy the text and save it to your favorite notes app so you don't miss any session you're interested in attending.

## Contribute

Feel free to contribute!
