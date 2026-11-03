# Win95 Portfolio Website: Design

Date: 2026-10-31
Owner: Huynh Thai Duong (GitHub: TDuong04)

## Intent

A personal portfolio that feels like a classic Windows 95 desktop. A visitor (recruiter, engineer, collaborator) lands on a teal desktop, opens icons into draggable windows, and learns who Duong is: a software engineer with work across backend, AI and systems. Retro style is the personality; the content must still be quick to find. Source of truth for content: `README.md` in the `TDuong04/TDuong04` profile repo (current, curated) and the CV (`main.tex`, not public).

## Goals

- Authentic Win95 look: bevelled borders, navy title-bar gradient, teal desktop, taskbar with Start button and clock, pixel/MS Sans Serif-style fonts.
- Desktop with icons; double-click (single tap on touch) opens a window. Windows are draggable, closable, focus-on-click, and several can be open at once. The taskbar lists open windows; clicking one focuses or restores it.
- A Start menu that lists the same sections as the icons.
- Usable on phones: windows go full-screen and stack; no drag required.
- Deployed free on GitHub Pages at `https://tduong04.github.io`.

## Non-goals

- No backend, CMS, login, analytics tracking or database.
- No data-engineering positioning (Spark/Iceberg/lakehouse work stays out).
- No sound.
- No full Windows emulation (no file system, real apps, or working Minesweeper in v1).

## Anti-goals (failure even if it "works")

- Content hard to find or read because of the gimmick.
- Phone number or home address appearing anywhere.
- Inaccessible: no keyboard path, no focus states, poor contrast in window bodies, ignored `prefers-reduced-motion`.
- A downloadable PDF resume.

## Decisions made with the owner

- Layout: "A", full desktop with icon-launched windows (not Start-menu-only, not a boot-heavy layout).
- Boot screen: **in scope, confirmed by owner.** Short fake BIOS + "Starting Windows 95" sequence, about 3 seconds, skippable by click or key, shown once per browser session (remembered in sessionStorage), skipped under `prefers-reduced-motion`. Deep links and the Welcome window appear after it.
- Stack (stated by Claude, accepted by owner): TypeScript, Vite, React, hand-written CSS for the Win95 look, no heavy UI library. Repo `TDuong04.github.io`, GitHub Pages, default `tduong04.github.io` domain.
- Resume: the Resume icon opens a window with a short **text** resume with links. **No PDF download. No phone number.**

## Windows and content

Icons on the left of the desktop:

1. **My Projects** (folder window). Each project is a sub-item that opens a detail window with description, tech tags, and links. Order: Vital Agent, PlantOS + The Garden Wars, Bosch CodeRace CAN safety system, Fish Detection on Jetson Nano, Scootr, DEVision Job Manager, RentMate, Travista, Guess Your Paddy, Clock Watch NUC140, Pyman.
2. **Experience**: OUCRU capstone (Capstone Collaborator / Full-Stack Developer, Apr - Sep 2026); NAVER Vietnam (Software Engineering Intern, Mar - Sep 2026); RMIT Neo Culture Tech Club (Technology Manager, Jun 2025 - Feb 2026). Tuturuuu is intentionally omitted.
3. **Skills**: grouped as Languages and backend; AI and machine learning; Embedded and systems; Frontend, cloud and tooling. Wording follows the README.
4. **Resume**: text version of the above plus education (RMIT BSE Honours, Oct 2022 - Sep 2026, GPA 3.64/4.0), highlights, and links.
5. **Contact**: email `thaiduong.works@gmail.com`, GitHub, LinkedIn. No phone.
6. Optional small extras (builder's call, only if cheap): a Notepad "About me", Recycle Bin, Shut Down dialog showing contact links.

Highlights to show (e.g. in Welcome/Resume): Bosch CodeRace 2nd Runner-Up; NAVER AI Hackathon 2nd Runner-Up; Vin Hackathon 2026 Finalist; Katalon Testathon Top 5.

Project detail links (existing): Vital Agent `https://github.com/Oucru-Innovations/vital-agent`; PlantOS `https://github.com/TDuong04/plantos-the-garden-wars` (demo `https://youtu.be/r9GJwLXUIRY`); CAN `https://github.com/TDuong04/Coderace-CAN-Signal-System`; Fish `https://github.com/TDuong04/image-fish-AI`; Scootr `https://github.com/TDuong04/Scootr`; DEVision `https://github.com/TDuong04/JobManager_Server`; RentMate `https://github.com/TDuong04/RentMate1`; Travista `https://github.com/dattv23/travista` (live `https://travista-kappa.vercel.app/`); Guess Your Paddy `https://github.com/TDuong04/COSC2753-machine-learning-assignment-2`; Clock Watch `https://github.com/TDuong04/Clock-Watch-NUC140`; Pyman `https://github.com/TDuong04/Pyman`. LinkedIn `https://www.linkedin.com/in/hu%E1%BB%B3nh-th%C3%A1i-d%C6%B0%C6%A1ng-4aa58824a/`.

## Constraints

- Static site only; builds to plain files for GitHub Pages; deploy via GitHub Actions on push to `main`.
- Content lives in one typed data file so edits do not touch components.
- Lighthouse accessibility target 90+; keyboard operable (open with Enter, close with Esc, focus order sane); respects `prefers-reduced-motion`.
- Fonts: use system/pixel web fonts that are free to ship (builder picks).

## Calls made by Claude after the builder check (owner to review)

- **Content source:** the builder adapts wording from the public `TDuong04/TDuong04` README (fetch `https://raw.githubusercontent.com/TDuong04/TDuong04/main/README.md`). Do not invent facts, numbers or descriptions beyond what is there. Project entries are text and tags only, no screenshots in v1.
- **Welcome window:** on desktop the site opens one `Welcome.exe` window automatically: name, role line ("Software Engineer"), the four highlights, and buttons that open Projects, Resume and Contact. On phones the desktop shows first, with Welcome as an icon, so icons are not hidden.
- **Deep links:** hash routes (e.g. `#/projects/vital-agent`, `#/resume`) open the matching window on load, so a link can be shared. Static `<title>`, description and Open Graph tags in `index.html`. No path routing, so no 404 fallback.

## Left to the builder

Component structure, window manager implementation, exact icons/pixel art (original or free-licence, no Microsoft assets), boot screen text, responsive breakpoints, extras in item 6, test approach.
