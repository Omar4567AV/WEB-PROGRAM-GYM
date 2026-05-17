I BUILD THIS PROJECT USING REACT
npm create vite@latest coach-platform

I CHOISE THE REQUERMENT OF PROJECT

[Open Requirements](./REQUIRMENTS.md)

I choice a achchictect for project following
src/
  app/
    App.tsx
    router.tsx
    providers/
      AuthProvider.tsx
      ToastProvider.tsx

  components/
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Modal.tsx
      Badge.tsx
      Spinner.tsx
    layout/
      DashboardLayout.tsx
      Sidebar.tsx
      Navbar.tsx
      AuthLayout.tsx
    cards/
      StatCard.tsx
      ClientCard.tsx
      PhotoCard.tsx
      ProgramCard.tsx
    forms/
      FormField.tsx

  features/
    auth/
      LoginPage.tsx
      RegisterPage.tsx
      ProtectedRoute.tsx
      RoleRoute.tsx
    client/
      ClientDashboard.tsx
      ClientProfile.tsx
    coach/
      CoachDashboard.tsx
      CoachClients.tsx
      CoachClientDetails.tsx
    calories/
      CaloriesCalculator.tsx
      CaloriesCircle.tsx
    workout/
      WorkoutProgram.tsx
      ProgramEditor.tsx
    progress/
      ProgressTracking.tsx
      WeeklyCheckIn.tsx
    photos/
      PhotosPage.tsx
      PhotoUpload.tsx

  services/
    api.ts              ← Axios instance (ready for backend)
    authService.ts
    clientService.ts
    workoutService.ts
    progressService.ts
    photoService.ts

  types/
    user.types.ts
    workout.types.ts
    progress.types.ts
    calories.types.ts

  data/
    mockUsers.ts
    mockClients.ts
    mockPrograms.ts
    mockProgress.ts
    mockPhotos.ts

  utils/
    calorieCalculator.ts
    levelCalculator.ts
    formatters.ts

  hooks/
    useAuth.ts
    useClients.ts
    useWorkout.ts

  styles/
    index.css
    ere's why it fits your project specifically:

You have clear, distinct features — auth, calories, workout, progress, photos, coach — each feature is a self-contained world
You have 2 user roles — client and coach features can live completely independently
You plan to connect a backend later — each feature's services/ folder maps directly to one API domain
Your app will grow — adding a new feature means adding one folder, touching nothing else
It matches your own instinct — you already suggested this structure
    
     Install all dependencies:
     npm install react-router-dom axios react-hot-toast lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
react-router-dom → create pages/routes
axios            → connect frontend to backend/API
react-hot-toast  → show notifications
lucide-react     → use icons

tailwindcss      → style your website fast
postcss          → process Tailwind CSS
autoprefixer     → make CSS work better on browsers

npx tailwindcss init -p → create Tailwind config files

## Debug Summary

A debug and cleanup pass was completed for the `coach-platform` project.

The project is a React + TypeScript + Vite fitness coaching SPA with coach and client dashboards, workout programs, calorie calculator, weekly check-ins, and photo tracking.

### Fixed Issues

- Fixed the Assign Program modal type mismatch in `CoachClientDetails.tsx`.
- Removed the unsafe `as any` cast.
- Fixed the Active Programs statistic in `CoachDashboard.tsx`.
- Implemented the Weekly Check-In form.
- Connected the Weekly Check-In form to `ProgressTracking.tsx`.
- Implemented the Photo Upload form.
- Connected the Photo Upload form to `PhotosPage.tsx`.
- Integrated the unused `CaloriesCircle` component into the calorie calculator.
- Removed unused Vite scaffold files:
  - `src/App.tsx`
  - `src/App.css`
  - `src/index.css`
- Removed unused source files:
  - `src/components/forms/FormField.tsx`
  - `src/utils/levelCalculator.ts`
- Fixed Sidebar icon color behavior during SPA navigation.
- Removed duplicate authentication guards from `DashboardLayout.tsx`.

### Build Result

The project was tested after the fixes using:

```bash
npm run build

