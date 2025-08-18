# Front-end for Social Media Networking App

A modern social networking platform built with Next.js, providing professional networking features including user profiles, company pages, groups, job postings, and real-time chat.

## 🚀 Features

- **User Profiles** - Professional profiles with education, experience, skills
- **News Feed** - Personalized content feed with posts, images, and videos
- **Networking** - Connect with professionals and follow companies
- **Real-time Chat** - Direct messaging with individual users and groups
- **Company Pages** - Create and manage company profiles
- **Groups** - Create and join professional interest groups
- **Job Portal** - Browse and apply for job listings
- **Dark Mode** - Toggle between light and dark themes

## 🛠️ Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Shadcn/ui** component library
- **Socket.io** for real-time communication

## 📋 Prerequisites

- Node.js 18.x or higher
- Backend server running (see main project README)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/social-media.git
   cd social-media/front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
front/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── chat/        # Chat interface
│   │   ├── company/     # Company pages
│   │   ├── feed/        # News feed
│   │   ├── group/       # Group pages
│   │   ├── jobs/        # Job listings
│   │   └── u/           # User profiles
│   ├── assets/          # Project assets
│   ├── components/      # Reusable components
│   │   ├── ui/          # UI components (shadcn)
│   │   ├── chat/        # Chat components
│   │   ├── company/     # Company components
│   │   └── profile/     # Profile components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── store/           # Redux store and slices
```

## 🚀 Build & Deployment

**Build for production**

```bash
npm run build
```

**Start production server**

```bash
npm start
```

## 🧪 Testing

```bash
npm run test
```

## 🔄 Integration with Backend

This front-end application communicates with the backend API located in the `../back` directory. Make sure the backend server is running before starting the front-end development server.

## 🔜 Upcoming Features

- Advanced search functionality
- Video calling in chat
- Analytics dashboard
- Mobile app version

## 📄 License

This project is licensed under the MIT License - see the LICENSE
