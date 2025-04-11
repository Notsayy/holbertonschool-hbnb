# AirBnB Clone - Part 4: Simple Web Client

## Overview
This phase focuses on front-end development to create an interactive web interface that connects with the back-end API developed in previous parts. The application is built using modern web technologies to provide a seamless user experience.

## Objectives
- Develop a user-friendly interface following design specifications
- Implement client-side functionality to interact with the back-end API
- Ensure secure and efficient data handling using JavaScript
- Apply modern web development practices for a dynamic single-page application

## Learning Goals
- Practical application of HTML5, CSS3, and JavaScript ES6
- Interaction with back-end services using Fetch API
- Implementation of JWT authentication and session management
- Client-side scripting for enhanced UX without page reloads

## Features

### Core Functionality
- **Responsive Design**: Mobile-friendly interface
- **Authentication System**: Secure login with JWT token storage
- **Dynamic Content Loading**: Fetch data without page reloads
- **Interactive Components**: Filtering, forms, and real-time updates

### Pages Implemented
1. **Login Page**
2. **Places Listing** with filtering
3. **Place Details** view
4. **Add Review** form

## Tasks Breakdown

### Task 1: Design Implementation
- Completed HTML/CSS files matching design specs
- Created all required pages with consistent styling
- Ensured responsive layout for different screen sizes

### Task 2: Login System
- Implemented authentication flow with back-end API
- JWT token storage in cookies for session management
- Error handling for failed login attempts

### Task 3: Places Listing
- Fetches and displays places data from API
- Client-side filtering by country
- Authentication check with redirect to login if needed

### Task 4: Place Details
- Detailed view with data fetched by place ID
- Dynamic loading of place information and amenities
- Conditional display of review form for authenticated users

### Task 5: Review System
- Secure form accessible only to authenticated users
- Data validation before submission
- Success/error feedback after submission

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **API Communication**: Fetch API
- **State Management**: Browser cookies (JWT)
- **Build Tools**: Native JavaScript (no frameworks)

## Installation
Clone the repository:
```bash
https://github.com/Notsayy/holbertonschool-hbnb
```
Then type this:
```bash
cd holbertonschool-hbnb/part4
```

Install requirements:
```bash
pip install -r requirements.txt
```

Run the back-end/api
```bash
python3 run.py
```

## Setup the front
I recommend that you install the extenson live server on vscode
Or use http-server:
```bash
npm install -g http-server
```
Then to run the site:
```bash
npx http-server -p 5500
```

Login:

Insert admin logs(email: admin@hbnb.io mdp : admin1234 )

Or test user logs(email: testuser@gmail.com : mdp azerty )

There are still some issues on the code , i know it.
If you guys have recommandations to make , it would be a pleasure

## Authors
- Notsayy