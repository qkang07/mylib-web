import { createContext, useState } from 'react'
import './App.css'
import { Button, Space, Spin, Typography } from '@douyinfe/semi-ui'
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
    <AppContext.Provider value={{os: sysInfo.os}}>
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
    </AppContext.Provider>
    </>
  )
}

export default App
