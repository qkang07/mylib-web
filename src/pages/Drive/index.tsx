import { Button, ButtonGroup, Input, List, Popover, Space, Table } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'
import EditCard from '../../comps/EditCard'

export type PathInfo = {
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
        <Input value={path}
          prefix={
          <span style={{padding: '6px 10px'}} >Path：</span>
          }
        suffix={
          <Button>Go</Button>
        } />
      </div>
      <div className={styles.pathList}>
        {/* {data?.map(item => {
          return <div key={item.Name} className={styles.pathItem}>
            <div>{item.Name}</div>
            <div>
              
              {item.Exist ? <IconCheckCircleStroked/> : <Button icon={<IconPlus/>} type='primary' >收录</Button> }
            </div>
          </div>
        })} */}

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
            width: 40,
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
              return <Space>
                <Popover content={<EditCard content={record} />}>
                {
                  record.Exist ? <Button size='small' icon={<IconCheckCircleStroked/>} onClick={e => {
                    e.stopPropagation()
                  }}>
                     已收录
                  </Button> : <Button size='small' theme='solid' icon={<IconPlus/>} onClick={e => {
                  e.stopPropagation()
                }} >收录</Button>
                }

                </Popover>
                
              </Space>
            }
          }
        ]}  ></Table>
      
      </div>
    </div>
  )
}

export default Drives