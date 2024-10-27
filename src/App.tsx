import { useState } from 'react'
import './App.css'
import { Button, Space, Typography } from '@douyinfe/semi-ui'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {

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
        <Typography.Text link={{href: '/attr_schema'}}>
          <Button>AttrSchemas</Button>
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
