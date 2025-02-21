import { createContext, useState } from 'react'
import './App.css'
import { Button, Space, Spin, Typography } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useRequest } from 'ahooks'
import { api } from './api'


export const AppContext = createContext({
  os: ''
})

function App() {

  const {data: sysInfo, loading} = useRequest(() => {
    return api.get('/sys/baseinfo').then(res => res.data)
  })

  if(!sysInfo && loading) {
    return <Spin/>
  }

  return (
    <>
    <AppContext.Provider value={{os: sysInfo?.os}}>
      <div className='site-nav'>
        <Space>
          <Button type='link' href='/drives' >Drives</Button>
          <Button type='link' href='/search' >Search</Button>
          <Button type='link' href='/attr_schema' >AttrSchemas</Button>
        </Space>
      </div>
      <div>
        <RouterProvider router={router}></RouterProvider>
      </div>
    </AppContext.Provider>
    </>
  )
}

export default App
