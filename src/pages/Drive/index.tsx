import { Button, ButtonGroup, Divider, Input, List, Popover, Space, Table, Tag, TagInput } from '@douyinfe/semi-ui'
import { IconBriefStroked, IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useContext, useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'
import EditCard from '../../comps/EditCard'
import path from 'path-browserify'
import RawFileAction from './RawFileAction'
import { AppContext } from '../../App'


export type PathInfo = {
  Name: string
  IsDir: boolean
  Size?: number
  Exist?: boolean
  Path?: string
  ContentId?: number
}

type Props = {}

const Drives = (props: Props) => {


  const {os} = useContext(AppContext)
  const [path, setPath] = useState<string[]>([])

  const {data, loading, runAsync: getPathContent} = useRequest<PathInfo[], [string[]] >((path: string[] = []) => {
    let pathStr = path.length ? path.join('/') + '/' : ''
    if(os !== 'windows') {
      pathStr = '/' + pathStr
    }

    return api.get<(string | PathInfo)[]>('/fs/path?path=' + encodeURIComponent(pathStr)).then(res => {
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
          item.Path = path + item.Name
          return item
        }
      })
    })
  }, {
    refreshDeps: []
  })

  const refreshPath = (path: string[]) => {
    setPath(path)
    getPathContent(path)
  }

  return (
    <div>
      <div>
        <TagInput value={path}
          draggable={false}
          renderTagItem={(v, i, onClose)=> {
            return <>
            {i === 0 && os !== 'windows' && <Divider margin={4} style={{borderColor: '#ccc', borderWidth: 1.5, transform: 'rotate(15deg)'}} layout='vertical' />} 
            <Button theme='borderless' type='tertiary' style={{paddingLeft: 4, paddingRight: 4}} size='small' onClick={() => {
              refreshPath(path.slice(0, i + 1))
            }} >{v}</Button>
            <Divider margin={4} style={{borderColor: '#ccc', borderWidth: 1.5, transform: 'rotate(15deg)'}} layout='vertical' />
            </> 
          }}
          onChange={v => {
            setPath(v)
          }}
          
          onKeyDown={(k) => {
            if(k.key === 'enter') {
              getPathContent(path)
            }
          }}
          prefix={
          <span style={{padding: '6px 10px'}} >Path：</span>
          }
        suffix={
          <Button onClick={() => {
            getPathContent(path)
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
          loading={loading}
          pagination={false}
         size="small"
          onRow={(record, index) => {
            return {
              onClick() {
                if(record?.IsDir) {
                  refreshPath([...path, record.Name])
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
            dataIndex: 'Size',
            render(v, record) {
              if(!record.IsDir) {
                return record.Size?.toLocaleString()
              }
              return <></>
              
            }
          },
          {
            title: 'Actions',
            render(_, record, index) {
              return <Space>
                <RawFileAction pathInfo={record}  />
              </Space>
            }
          }
        ]}  ></Table>
      
      </div>
    </div>
  )
}

export default Drives