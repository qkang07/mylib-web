import { Button, ButtonGroup, Divider, Input, List, Popover, Space, Table, Tag, TagInput } from '@douyinfe/semi-ui'
import { IconBriefStroked, IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'
import EditCard from '../../comps/EditCard'
import path from 'path-browserify'
import RawFileAction from './RawFileAction'
import { AppContext } from '../../App'
import { useSearchParams } from 'react-router-dom'


export type PathInfo = {
  Name: string
  IsDir: boolean
  Size?: number
  Exist?: boolean
  Path?: string
  ContentId?: number
}

type Props = {}

const getTableHeight = () => window.innerHeight - 124

const Drives = (props: Props) => {


  const {os} = useContext(AppContext)
  const [scroll, setScroll] = useState(() =>({y: getTableHeight()}) )
  const [params, setParams] = useSearchParams({
    path: ''
  })

  const paths = useMemo(() => {
    const pathStr = params.get('path') || ''
    return pathStr.split('/') || []
  }, [params])

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScroll({y: getTableHeight()})
    })
  }, [])

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
          item.Path = pathStr + item.Name
          return item
        }
      })
    })
  }, {
    refreshDeps: []
  })

  const refreshPath = (path: string[]) => {
    setParams({
      path: path.join('/')
    })
    getPathContent(path)
  }

  console.log(scroll)

  return (
    <div>
      <div>
        <TagInput value={paths}
          draggable={false}
          renderTagItem={(v, i, onClose)=> {
            return <>
            {i === 0 && os !== 'windows' && <Divider margin={4} style={{borderColor: '#ccc', borderWidth: 1.5, transform: 'rotate(15deg)'}} layout='vertical' />} 
            <Button theme='borderless' type='tertiary' style={{paddingLeft: 4, paddingRight: 4}} size='small' onClick={() => {
              refreshPath(paths.slice(0, i + 1))
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
          scroll={scroll}
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
            dataIndex: 'Name',
            sorter(a, b) {
              return (a?.Name || '') > (b?.Name || '') ? 1 : -1
            },
          },
          {
            title: 'Size',
            dataIndex: 'Size',
            render(v, record) {
              if(!record.IsDir) {
                return record.Size?.toLocaleString()
              }
              return <></>
              
            },
            sorter(a, b, order) {
              if(a?.IsDir) {
                return order === 'descend' ? -1 : 1
              }
              if(b?.IsDir ) {
                return order === 'descend' ? 1 : -1
              }
              
              return a!.Size! > b!.Size! ? 1 : -1
            },
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