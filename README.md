I BUILD THIS PROJECT USING REACT
npm create vite@latest coach-platform
I CHOISE THE REQUERMENT OF PROJECT
# Coach Platform Frontend Requirements

## 1. Project Name

Coach Platform / Fitness Coach App

## 2. Project Type

Frontend web application built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

The backend and database will be connected later.

---

# 3. Main Idea

The project is a fitness coach web platform.

The app helps clients calculate their calories, know their gym level, track progress, upload photos, and follow workout programs.

The coach/admin can manage clients, view their information, check their progress, and edit their workout programs.

---

# 4. User Roles

The project has two main roles:

## Client

The client can:

- Create an account
- Login
- Calculate daily calories
- View gym level
- View workout program
- Upload food/body photos
- Add calories for meals
- Add weekly weight
- Add body measurements in cm
- Send notes/messages to coach
- Request a program change

## Coach/Admin

The coach can:

- Login
- View all active clients
- Search clients
- Filter clients
- Open client details
- View client calories
- View client gym level
- View client progress
- View latest photos
- View weekly weight updates
- View body measurements
- Edit client workout program
- Add notes for client

---

# 5. Authentication Requirements

The frontend should include:

- Login page
- Register page
- Mock authentication for now
- Store user data in localStorage
- Logout functionality
- Protected routes
- Role-based routes

After login:

- Client goes to Client Dashboard
- Coach/Admin goes to Coach Dashboard

---

# 6. Pages Required

The project should include these pages:

1. Home Page
2. Login Page
3. Register Page
4. Client Dashboard
5. Coach Dashboard
6. Client Profile Page
7. Calories Calculator Page
8. Workout Program Page
9. Progress Tracking Page
10. Photos Page
11. Coach Clients Page
12. Coach Client Details Page
13. Settings Page
14. Not Found Page

---

# 7. Client Dashboard Requirements

The client dashboard should show:

- Daily calorie target
- Calories eaten today
- Calorie progress circle
- Gym level
- Current workout program
- Weekly progress
- Latest uploaded photos
- Coach notes
- Button to request program change

---

# 8. Coach Dashboard Requirements

The coach dashboard should show:

- Total active clients
- Clients by level
- Clients by goal
- Recent client updates
- Client cards
- Search and filter options

The coach should be able to click a client card and open full client details.

---

# 9. Client Details for Coach

When the coach opens a client, the coach should see:

- Client name
- Age
- Gender
- Height
- Weight
- Goal
- Activity level
- Gym experience
- Gym level
- Calories result
- Current workout program
- Weekly weight history
- Body measurements in cm
- Last uploaded photos
- Meal photos with calories
- Client notes/messages

The coach can edit the client workout program.

---

# 10. Calories Calculator Requirements

The calculator should ask for:

- Age
- Gender
- Height
- Weight
- Activity level
- Goal

Goals:

- Lose fat
- Maintain weight
- Gain muscle

The calculator should return:

- Maintenance calories
- Fat loss calories
- Muscle gain calories
- Protein target
- Carbs target
- Fat target
- Water target
- BMI

---

# 11. Gym Level Requirements

The app should calculate gym level using gym experience.

Gym levels:

- Beginner: 0 to 6 months
- Intermediate: 6 months to 2 years
- Advanced: more than 2 years

The coach can view the client level.

---

# 12. Workout Program Requirements

The maximum training days per week is 5 days.

The app should support all program types:

- Full Body
- Push Pull Legs
- Upper Lower
- Body Part Split
- Fat Loss Program
- Home Workout

The client can view the program.

The coach can edit the program.

The client can request to change the program if they do not like it.

---

# 13. Progress Tracking Requirements

Every weekend, the client can add:

- Current weight
- Waist measurement in cm
- Chest measurement in cm
- Arms measurement in cm
- Legs measurement in cm
- Hips measurement in cm
- Notes
- Progress photos

---

# 14. Photos Requirements

The client can upload:

- Body progress photos
- Meal photos

For meal photos, the client can add:

- Meal name
- Calories
- Date
- Notes

The coach can view latest photos for each client.

---

# 15. Design Requirements

The design style should be:

- Modern fitness style
- Clean
- Professional
- Responsive

Main colors:

- Red
- White
- Yellow

The website should support:

- Arabic
- English

The design should be ready for RTL layout for Arabic.

---

# 16. Responsive Requirements

The app should work on:

- Mobile
- Tablet
- Desktop

The dashboard should include:

- Navbar
- Sidebar
- Mobile sidebar menu
- Responsive cards
- Responsive tables/forms

---

# 17. State Management Requirements

For the frontend version, use:

- React state
- Context API
- localStorage

Use localStorage for:

- Mock login user
- Role
- Token placeholder
- Basic saved data if needed

---

# 18. Backend-Ready Requirements

The app will connect to backend later.

The frontend should have service files ready:

- api.ts
- authService.ts
- clientService.ts
- workoutService.ts
- progressService.ts
- photoService.ts

Use Axios setup for future API.

For now, use mock data.

---

# 19. Mock Data Requirements

Create mock data for:

- Clients
- Coach/Admin user
- Workout programs
- Calories data
- Progress history
- Body measurements
- Meal photos
- Body photos
- Client messages

---

# 20. Project Architecture Requirement

Use a professional frontend architecture.

Preferred architecture:

Feature-based architecture.

Suggested structure:

src/
  app/
  components/
  features/
    auth/
    client/
    coach/
    calories/
    workout/
    progress/
    photos/
  services/
  types/
  data/
  utils/
  hooks/
  assets/
  styles/

---

# 21. Required Components

The project should include reusable components:

- Button
- Input
- Select
- Card
- Modal
- Navbar
- Sidebar
- DashboardLayout
- StatCard
- ClientCard
- ProgressCircle
- PhotoCard
- ProgramCard
- ProtectedRoute
- RoleBasedRoute

---

# 22. Libraries Required

Use:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React

Optional:

- Framer Motion
- Recharts

---

# 23. Final Goal

The final frontend should be a real working React TypeScript project.

It should include:

- Clean architecture
- Working pages
- Mock login
- Client dashboard
- Coach dashboard
- Calories calculator
- Workout program system
- Progress tracking
- Photo tracking
- Backend-ready services
- Responsive design
- Arabic and English support
