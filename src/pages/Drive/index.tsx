import { Button, ButtonGroup, Input, List, Table } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'

type PathInfo = {
  Name: string
  IsDir: boolean
  Size?: number
  Exist?: boolean
}

type Props = {}

const Drives = (props: Props) => {

  const [path, setPath] = useState('')

  const {data, loading, runAsync: getPathContent} = useRequest<PathInfo[], [void] >(() => {
    return Promise.resolve([
      {
        Name: 'sdf',
        IsDir: false,
        Size: 123,
        Exist: false
      },
      {
        Name: 'exist',
        IsDir: false,
        Size: 123,
        Exist: true
      },
      {
        Name: 'folder',
        IsDir: true,
        Exist: false
      }
    ])
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
      <div className={styles.pathList}>
        {data?.map(item => {
          return <div key={item.Name} className={styles.pathItem}>
            <div>{item.Name}</div>
            <div>
              
              {item.Exist ? <IconCheckCircleStroked/> : <Button icon={<IconPlus/>} type='primary' >收录</Button> }
            </div>
          </div>
        })}

        <Table
         size="small"
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

export default Drives