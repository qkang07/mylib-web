import { Button, ButtonGroup, Input, List, Popover, Space, Table } from '@douyinfe/semi-ui'
import { IconBriefStroked, IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'
import EditCard from '../../comps/EditCard'
import path from 'path-browserify'


export type PathInfo = {
  Name: string
  IsDir: boolean
  Size?: number
  Exist?: boolean
  Path?: string
}

type Props = {}

const Drives = (props: Props) => {

  const [currentPath, setCurrentPath] = useState('')

  const {data, loading, runAsync: getPathContent} = useRequest<PathInfo[], [void] >(() => {
    // return Promise.resolve([
    //   {
    //     Name: 'sdf',
    //     IsDir: false,
    //     Size: 123,
    //     Exist: false
    //   },
    //   {
    //     Name: 'exist',
    //     IsDir: false,
    //     Size: 123,
    //     Exist: true
    //   },
    //   {
    //     Name: 'folder',
    //     IsDir: true,
    //     Exist: false
    //   }
    // ])
    let v = currentPath
    if(!v.endsWith('/')){
      v = v + '/'
      setCurrentPath(v)
    }
    return api.get<(string | PathInfo)[]>('/fs/path?path=' + encodeURIComponent(v)).then(res => {
      console.log(res.data)
      
      return res.data.map(item => {
        // drives 会是这种情况
        if(typeof item === 'string') { 
          return {
            Name: item,
            IsDir: true,
            Path: item
          }
        } else {
          item.Path = path.join(currentPath, item.Name)
          return item
        }
      })
    })
  }, {
    refreshDeps: []
  })

  return (
    <div>
      <div>
        <Input value={currentPath}
          onChange={v => {
            
            setCurrentPath(v)
          }}
          onEnterPress={() => {
            
            getPathContent()
          }}
          prefix={
          <span style={{padding: '6px 10px'}} >Path：</span>
          }
        suffix={
          <Button onClick={() => {
            getPathContent()
          }}>Go</Button>
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
          pagination={false}
         size="small"
          onRow={(record, index) => {
            return {
              onClick() {
                if(record.IsDir) {

                  setCurrentPath(path.join(currentPath, record.Name) + '/')
                  setTimeout(() => {
                    getPathContent()
                  }, 0);
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
                return <IconBriefStroked/>
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