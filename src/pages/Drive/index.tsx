import { Button, Input, Table } from '@douyinfe/semi-ui'
import { IconFile, IconFolder } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import { api } from '../../api'

type PathInfo = {
  Name: string
  IsDir: boolean
  Size?: number
}

type Props = {}

const index = (props: Props) => {

  const [path, setPath] = useState('')

  const {data, loading, runAsync: getPathContent} = useRequest<PathInfo[], [void] >(() => {
    return api.get<(string | PathInfo)[]>('/fs/path?path=' + encodeURIComponent(path)).then(res => {
      console.log(res.data)
      
      return res.data.map(item => {
        if(typeof item === 'string') {
          return {
            Name: item,
            IsDir: true
          }
        } else {
          return item
        }
      })
    })
  }, {
    refreshDeps: [path]
  })

  return (
    <div>
      <div>
        <Input value={path}  />
      </div>
      <div>
        <Table
          onRow={(record, index) => {
            return {
              onClick() {
                if(record.IsDir) {
                  setPath(path + '/' + record.Name)
                }
              }
            }
          }}
        dataSource={data} columns={[
          {
            title: '',
            dataIndex: 'IsDir',
            render(text, record, index) {
              if(record.IsDir) {
                return <IconFolder />
              } else {
                return <IconFile/>
              }
            }
          },
          {
            title: 'Name',
            dataIndex: 'Name'
          },
          {
            title: 'Size',
            dataIndex: 'Size'
          },
          {
            title: 'Actions',
            render(_, record, index) {
              return <div>
                <Button></Button>
              </div>
            }
          }
        ]}  ></Table>
      
      </div>
    </div>
  )
}

export default index