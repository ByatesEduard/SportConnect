import { ThemeProvider } from './components/ui'
import './components/ui/styles.css'
import { Layout } from './components'
import { Routes, Route } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { MainPage } from './pages/MainPage'
import { PostsPage } from './pages/PostsPage'
import { PostPage } from './pages/PostPage'
import { AddPostPage } from './pages/AddPostPage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { RolePage } from './pages/RolePage'
import { PersonalInformation } from './pages/PersonalInformation'
import { EditPostPage } from './pages/EditPostPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import { getMe, selectToken } from './redux/features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)

  useEffect(() => {
    if (token) {
      dispatch(getMe())
    }
  }, [dispatch, token])

  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='home' element={<MainPage />} />
          <Route path='posts' element={<PostsPage />} />
          <Route path=':id' element={<PostPage />} />
          <Route path=':id/edit' element={<EditPostPage />} />
          <Route path='new' element={<AddPostPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='role' element={<RolePage />} />
          <Route path='personal' element={<PersonalInformation />} />
        </Routes>

        <ToastContainer position='bottom-right' />
      </Layout>
    </ThemeProvider>
  )
}

export default App
