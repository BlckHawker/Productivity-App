# [Insert Project name here] - Project Plan

## 1. Project Overview / Introduction
> What to include: A short summary of what the project is, who it is for, and the main problem it solves.

**Example:**
This project aims to build a web dashboard and mobile companion app that monitors indoor air quality using Bluetooth-connected IoT sensors. The system collects data such as CO₂ levels, humidity, and temperature, and notifies users when air quality drops below safe thresholds.


---

## 2. Objectives
> What to include: A list of broad, strategic goals the project aims to achieve.

**Example:**
- Provide real-time visibility into indoor air quality metrics.
- Alert users to poor air quality conditions in a timely manner.
- Enable historical data review and comparison over time.
- Minimize battery usage for sensors via efficient polling intervals.
- Ensure accessibility across desktop and mobile devices.
---

## 3. Functional Requirements
> What to include: A clear, specific list of what the system must do (features and behaviors).

**Example:**
- Connect to Bluetooth sensors and collect air quality data every 5 minutes.
- Display current sensor readings in a web dashboard.
- Send push notifications when air quality exceeds danger thresholds.
- Allow users to export data as CSV files.
- Display graphs of historical sensor data over selected timeframes.
---

## 4. Non-Functional Requirements
> What to include: Constraints and quality requirements that affect how the system performs.

**Example:**
- The mobile app must sync data within 2 seconds of connecting to a sensor.
- The dashboard should render charts in under 500ms.
- The API must handle at least 500 concurrent sensor uploads.
- The application should follow WCAG 2.1 AA accessibility standards.
- The system must support offline mode and sync when internet resumes.
---

## 5. Technology Stack
> What to include: Languages, frameworks, libraries, tools, platforms, and services used in the project. Bonus to include version

**Example:**
- **Frontend:** React.js (with TypeScript)
- **Mobile:** Flutter (for Android/iOS)
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **IoT Communication:** Bluetooth LE via Web Bluetooth API
- **Notifications:** Firebase Cloud Messaging
- **Testing:** Mocha + Chai
- ***Linting:** ESLint + Prettier
- **Dev Tools:** Docker, Postman, Vite
---

## 6. Epics and User Stories

> What to include: Group related features into Epics and describe user-facing functionality in user stories.

### Epic 1: Sensor Data Collection
| **Name**                         | **Description**                                                                | **User Story**                                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1 - Sensor Pairing** | Connect new sensors to the app      | As a user, I want to pair a new sensor with my account so that I can monitor the room it’s placed in.            |
| **1.2 - Data Collection** | Poll and store environmental readings      | As a user, I want the app to automatically collect data every 5 minutes so I don’t have to do it manually.            |


#### 1.1 Sensor Pairing Acceptance Criteria
 - [ ] The user can scan for nearby Bluetooth devices from the mobile app.
 - [ ] The app must display a list of available, unpaired sensors.
 - [ ] Upon pairing, the sensor’s metadata (location name, device ID) is saved to the user’s account.

#### 1.2 - Data Collection Acceptance Criteria
 - [ ] Every 5 minutes, the app collects temperature, humidity, and CO₂ values.
 - [ ] The collected data is timestamped and stored in the local database.
 - [ ] Data is synced to the cloud when online.

---


# 7. Backlogged Features
> What to include: A list of optional or long-term ideas you'd like to explore later. These aren’t guaranteed to be implemented.

**Example:**

  - [ ] Integrate with Google Home or Alexa for voice-based air quality updates.
  - [ ] Add gamification badges for users who maintain good air quality.
  - [ ] Implement machine learning to detect unusual air quality patterns.
  - [ ]  Add Apple Watch integration for quick glances at current room stats.
  - [ ] Support multiple users per sensor (e.g., for shared offices or schools).