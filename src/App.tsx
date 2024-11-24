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
          <Button theme='borderless' type='tertiary' >Drives</Button>
        </Typography.Text>
        <Typography.Text link={{href: '/search'}}>
          <Button theme='borderless'  type='tertiary' >Search</Button>
        </Typography.Text>
        <Typography.Text link={{href: '/attr_schema'}}>
          <Button theme='borderless'  type='tertiary' >AttrSchemas</Button>
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
