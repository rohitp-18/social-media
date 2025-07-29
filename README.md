# Social Media Networking Website

A full-stack MERN social media platform that enables users to connect, share content, and build professional networks. Features include user profiles, company pages, groups, job postings, real-time chat, and comprehensive networking capabilities.

## 🚀 Features

### Core Functionality

- **User Authentication & Profiles** - Complete user registration, login, and profile management
- **Posts & Content Sharing** - Create posts with text, images, videos, tags, and external links
- **Social Networking** - Follow users, companies, and join groups
- **Real-time Chat** - Direct messaging with socket.io integration
- **Job Portal** - Post and apply for jobs with skill matching
- **Company Pages** - Create and manage company profiles with follower system
- **Groups** - Create, join, and manage community groups
- **Search & Discovery** - Advanced search for users, companies, groups, and content

### Advanced Features

- **Skill Management** - Tag and search content by skills
- **Education & Experience** - Comprehensive professional profile building
- **Notifications** - Real-time notifications for interactions
- **Media Upload** - Image and video sharing with Cloudinary integration
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Dark Mode Support** - Toggle between light and dark themes

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Shadcn/ui** - Modern UI component library
- **Socket.io Client** - Real-time communication

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **Cloudinary** - Image and video management
- **Multer** - File upload handling

## 📁 Project Structure

```
social-media/
├── back/                     # Backend application
│   ├── config/              # Configuration files
│   │   ├── mongodb.ts       # Database connection
│   │   ├── multer.ts        # File upload config
│   │   └── sendEmail.ts     # Email configuration
│   ├── controller/          # Route controllers
│   │   ├── userController.ts
│   │   ├── postController.ts
│   │   ├── companyController.ts
│   │   ├── groupController.ts
│   │   ├── chatController.ts
│   │   └── ...
│   ├── middleware/          # Custom middleware
│   ├── model/              # Database models
│   ├── router/             # API routes
│   ├── utils/              # Utility functions
│   └── index.ts            # Entry point
├── front/                   # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── store/          # Redux store and slices
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── ...config files
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account for media storage

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rohitp-18/social-media.git
   cd social-media
   ```

2. **Backend Setup**

   ```bash
   cd back
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `back/config/` directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. **Start Backend Server**

   ```bash
   npm run dev
   ```

5. **Frontend Setup**

   ```bash
   cd ../front
   npm install
   ```

6. **Start Frontend Development Server**

   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/profile      # Get user profile
```

### User Endpoints

```
GET    /api/users/:id       # Get user profile
PUT    /api/users/:id       # Update user profile
DELETE /api/users/:id       # Delete user account
POST   /api/users/follow    # Follow/unfollow user
```

### Post Endpoints

```
GET    /api/posts           # Get all posts
POST   /api/posts           # Create new post
PUT    /api/posts/:id       # Update post
DELETE /api/posts/:id       # Delete post
POST   /api/posts/:id/like  # Like/unlike post
```

### Company Endpoints

```
GET    /api/companies       # Get all companies
POST   /api/companies       # Create company
PUT    /api/companies/:id   # Update company
DELETE /api/companies/:id   # Delete company
POST   /api/companies/:id/follow # Follow company
```

### Group Endpoints

```
GET    /api/groups          # Get user groups
POST   /api/groups/create   # Create group
PUT    /api/groups/:id      # Update group
DELETE /api/groups/:id      # Delete group
POST   /api/groups/:id/join # Join/leave group
```

## 🎨 Key Components

### Frontend Components

- **Post** - Displays individual posts with interactions
- **ProfileCard** - User profile information display
- **ChatBox** - Real-time messaging interface
- **CompanyProfile** - Company page layout
- **GroupProfile** - Group information and management
- **PostForm** - Multi-step post creation form

### Backend Models

- **User** - User account and profile data
- **Post** - Social media posts and interactions
- **Company** - Company profiles and followers
- **Group** - Community groups and memberships
- **Chat/Message** - Real-time messaging system
- **Job** - Job postings and applications

## 🔧 Development Scripts

### Backend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or other static hosting platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit Patil** - [GitHub Profile](https://github.com/rohitp-18)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn/ui for beautiful components
- MongoDB for flexible database solutions
- Cloudinary for media management
- Socket.io for real-time functionality

---

**Happy Coding!** 🚀
