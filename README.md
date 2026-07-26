## Project Overview
Z-Pass is a QR code-based attendance and session tracking system prototype. It allows event participants to register and receive a unique QR code for seamless check-in at various event sessions.

## Problem Statement
Large events with multiple simultaneous tracks face severe bottlenecks during check-in. Manual verification is slow, leading to long queues. Organizers lack real-time data on room capacity, and volunteers spend excessive time on manual data entry rather than assisting attendees.

## Features
- Web-based registration portal for attendees, speakers, and volunteers.
- Passcode-protected registration for privileged roles.
- Automated generation of unique QR codes for each user.
- Local CSV-based data storage for rapid prototyping.
- Responsive user interface.

## Technology Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API Routes, Node.js
- Storage: CSV file processing
- Utilities: qrcode, uuid

## Setup Instructions
1. Clone the repository to your local machine.
2. Open a terminal and navigate to the project directory.
3. Run "npm install" to install all required dependencies.
4. Run "npm run dev" to start the development server.
5. Open a web browser and navigate to http://localhost:3000 to view the application.

## Future Scope
- Transition from local CSV storage to a robust relational database like PostgreSQL.
- Develop a dedicated volunteer web application with an integrated camera scanner to process QR codes at room entrances.
- Implement real-time dashboard analytics for event organizers to monitor room capacities.
