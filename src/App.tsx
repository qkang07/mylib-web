import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Space, Typography } from '@douyinfe/semi-ui'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='site-nav'>
      <Space>
        <Typography.Text link={{href: '/drives'}}>
          <Button >Drives</Button>
        </Typography.Text>
        <Typography.Text link={{href: '/search'}}>
          <Button>Search</Button>
        </Typography.Text>
      </Space>
     </div>
     <div>
      <RouterProvider router={router}></RouterProvider>
     </div>
    </>
  )
}

export default App
