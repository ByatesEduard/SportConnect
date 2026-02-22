# SportConnect - Fitness Social Platform

A modern fitness social platform built with React, Redux, Node.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Registration, login, profile management
- **Multi-step Registration**: Initial signup with email/username, followed by detailed profile information
- **Protected Routes**: Secure navigation with authentication guards
- **Profile Management**: Upload photos, update personal information
- **Modern UI**: Responsive design with Tailwind CSS
- **Toast Notifications**: User-friendly feedback system
- **File Upload**: Profile image management
- **Rate Limiting**: API protection against abuse

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Toastify** - Notification system
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-fileupload** - File upload handling
- **express-rate-limit** - Rate limiting

## 📋 Prerequisites

- Node.js 16+
- MongoDB database
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd SportConnect
```

### 2. Install dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### 3. Environment Setup

#### Server Environment
Copy `.env.example` to `.env` and update the values:

```bash
cd server
cp .env.example .env
```

Update the following variables:
- `DB_USER` - Your MongoDB username
- `DB_PASSWORD` - Your MongoDB password  
- `DB_NAME` - Your database name
- `JWT_SECRET` - Your JWT secret key (at least 32 characters)
- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Frontend URL (default: http://localhost:3000)

### 4. Run the application

#### Start the server
```bash
cd server
npm run dev
```

#### Start the client
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📁 Project Structure

```
SportConnect/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   │   ├── MainPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── PersonalInformation.jsx
│   │   │   └── ...
│   │   ├── redux/         # Redux store
│   │   │   └── features/
│   │   │       └── auth/
│   │   │           └── authSlice.js
│   │   ├── utils/         # Utility functions
│   │   │   └── axios.js
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/        # Route controllers
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/            # Express routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── utils/             # Utility functions
│   │   └── checkAuth.js
│   ├── validation/        # Input validation
│   │   ├── auth.js
│   │   └── profile.js
│   ├── uploads/           # File upload directory
│   ├── .env.example       # Environment variables template
│   └── package.json
└── README.md
```

## 🔐 Authentication Flow

1. **Registration**: User provides username, email, password, and telephone
2. **Email Verification**: Server validates email format and uniqueness
3. **Token Generation**: JWT token created and stored in localStorage
4. **Profile Completion**: User redirected to personal information page
5. **Profile Update**: Additional details and profile photo uploaded

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Protected Routes**: Authentication guards for sensitive pages
- **File Upload Limits**: Size and type restrictions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

## 🎨 UI Components

### Authentication Pages
- **Login Page**: Modern split-screen design with email/password
- **Register Page**: Multi-step registration with validation
- **Personal Information**: Profile completion with photo upload

### Navigation
- **Navbar**: Responsive navigation with auth state
- **Protected Routes**: Route guards for authenticated users
- **Public Routes**: Accessible without authentication

## 🔧 Development

### Available Scripts

#### Client
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

#### Server
```bash
npm run dev        # Start with nodemon
```

### Environment Variables

#### Development
```bash
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000
```

#### Production
```bash
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB credentials in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **JWT Token Error**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration (30 days)

3. **CORS Issues**
   - Verify `CLIENT_URL` matches your frontend URL
   - Check browser console for CORS errors

4. **File Upload Issues**
   - Ensure `uploads` directory exists
   - Check file size limits (5MB max)
   - Verify file permissions

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
