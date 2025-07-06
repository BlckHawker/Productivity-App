# Hawker Stardew Discord Bot

A Discord bot built for [Hawker's Stardew Modding Server](https://discord.gg/mthtsCYy6d), designed to send automated notifications for new Twitch streams, YouTube videos, betas tests, and mods uploads by Hawker.
**Replace with breif description of project**

---

## Project Purpose
**Replace with a bit more detailed description of project and general purpose**

The Stardew Discord Bot helps automate community updates so moderators don't need to manually track and post content alerts. It ensures reliable, timely notifications for Hawker's:

- Twitch streams (Stardew-related and others)
- YouTube uploads (Stardew-related and others)
- Stardew beta builds
- Stardew Nexus mods updates/releases
![image](https://github.com/user-attachments/assets/61d1135c-7ed7-4cc3-8839-529577282c7f)
<img width="827" alt="image" src="https://github.com/user-attachments/assets/0b4e8d3c-5195-48b4-a262-895183b95a3e" />

---

## Tech Stack
**Replace with finalized tech stack**
- **Node.js**
- **discord.js**
---

## Branch Structure

| Branch     | Purpose                                         | Who Can Push?   | PR Target? |
|------------|--------------------------------------------------|------------------|------------|
| `main`     | Production branch — live application version             | Hawker only      | ❌   |
| `development` | Active development — all PRs must go here        | PRs only, merged by Hawker | ✅  |
| `staging`  | Final staging/test environment before production | Hawker only      | ❌   |

---

## Getting Started (For Developers)

### Requirements
**Replace with requirements and installs**
- **Node.js** (`v22.14.0`)
   - **discord.js** (`v14.16.3`)
   - **jest.js**  (`v29.7.0`)
   - **dotenv** (`v16.4.7`)
   - **@octokit/rest** (`v18.12.0`)
   - **cron**: (`v4.3.0`)
   - **node-fetch** (`v2.7.0`)

---

### Setup Instructions
**Replace with accurate setup instructions**

1. Clone the repository from main branch
```bash
git clone -b main https://github.com/BlckHawker/Stardew-Discord-Bot.git
```
2. Install dependencies
```bash
npm install
```
3. Copy make a copy of `example.env` called `.env` and add the corresponding information. Keep the `""` around the information that has it.

4. Run bot on local server

```bash
npm run start
```

---

### How to Make a Pull Request (PR)

**Replace with PR template links**

> PRs must **target `development`** and follow this checklist.

#### Checklist:
1. Create your feature/bugfix branch from `main`
    ```bash
    git checkout main
    git pull
    git checkout -b feature/my-awesome-feature
    ```
2. Implement your changes.
3. Add unit tests (if applicable).
4. Commit your work with a clear message.
5. Push to your fork or branch:
    ```bash
    git push origin feature/my-awesome-feature
    ```
6. Open a Pull Request targeting `development`.
---

### PR Description Template

Type: Feature / Bug Fix
Description: Briefly explain what your change does.

#### Bug Fix

- Steps to Reproduce:
   1. Step-by-step instructions
   2. ...
- Expected Behavior: Describe what should happen.
- Actual Behavior: Describe what actually happens.

#### New Feature

- How to Use:
   1. Step-by-step instructions to test or use the feature
   2. ...

#### Optional
- Media: Include screenshots or GIFs if available (optional but appreciated)
- Additional notes
---

## Contributor Roles

- **Hawker (Kovu)** – Project owner, maintainer & release manager  
- **You?** – Contribute via pull requests and help make the bot better!

---

## License

[MIT](https://github.com/BlckHawker/Stardew-Discord-Bot/blob/master/LICENSE) – Open source and open to contributions.
