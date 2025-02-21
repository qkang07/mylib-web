import { Button, Divider, Space, Table } from 'antd'
import { IconBriefStroked, IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import React, { useContext, useEffect, useState } from 'react'
import { api } from '../../api'
import styles from './index.module.scss'
import EditCard from '../../comps/EditCard'
import RawFileAction from './RawFileAction'
import { AppContext } from '../../App'
import { useSearchParams } from 'react-router-dom'
import { ContentModel, FSContent } from '../../types/content'
import { TagInput } from '@douyinfe/semi-ui'




type Props = {}

const getTableHeight = () => window.innerHeight - 124

const Drives = (props: Props) => {


  const {os} = useContext(AppContext)
  const [scroll, setScroll] = useState(() =>({y: getTableHeight()}) )
  const [params, setParams] = useSearchParams({
    path: ''
  })

  const [currentContent,setCurrentContent] = useState<ContentModel>()

  const [pathArr, setPathArr] = useState<string[]>([])


  useEffect(() => {
    window.addEventListener('resize', () => {
      setScroll({y: getTableHeight()})
    })
    // 只有第一次执行这个，后面的 params 变更都直接在程序内触发
    const pathStr = params.get('path') || ''
    const paths = pathStr ? pathStr.split('/') : []
    setPathArr(paths)
    getPathContent(paths)
  }, [])


  const {data, loading, runAsync: getPathContent} = useRequest<FSContent[], [string[]] >((path: string[] = []) => {
    let pathStr = path.length ? path.join('/') + '/' : ''
    if(navigator.platform !== 'Win32') {
      pathStr = '/' + pathStr
    }

    return api.get<(string | FSContent)[]>('/fs/path?path=' + encodeURIComponent(pathStr)).then(res => {
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
    refreshDeps: [],
    manual: true
  })

  const refreshPath = (paths: string[]) => {
    setPathArr([...paths])
    setParams({
      path: paths.join('/')
    })
    getPathContent(paths)
  }


  return (
    <div>
      <div>
        <TagInput value={pathArr}
          draggable={false}
          renderTagItem={(v, i, onClose)=> {
            return <>
            {i === 0 && os !== 'windows' && <Divider margin={4} style={{borderColor: '#ccc', borderWidth: 1.5, transform: 'rotate(15deg)'}} layout='vertical' />} 
            <Button theme='borderless' type='tertiary' style={{paddingLeft: 4, paddingRight: 4}} size='small' onClick={() => {
              refreshPath(pathArr.slice(0, i + 1))
            }} >{v}</Button>
            <Divider margin={4} style={{borderColor: '#ccc', borderWidth: 1.5, transform: 'rotate(15deg)'}} layout='vertical' />
            </> 
          }}
          onChange={v => {
            
            setPathArr(v)
          }}
          
          onKeyDown={(k) => {
            if(k.key === 'enter') {
              getPathContent(pathArr)
            }
          }}
          prefix={
          <span style={{padding: '6px 10px'}} >Path：</span>
          }
        suffix={
          <Button onClick={() => {
            getPathContent(pathArr)
          }}>Go</Button>
        } />
      </div>
      <div className={styles.contentTable}>
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
                  refreshPath([...pathArr, record.Name])
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
                <RawFileAction onSelect={(content) => setCurrentContent(content)} fsContent={record}  />
              </Space>
            }
          }
        ]}  ></Table>
        {currentContent && <div className={styles.contentDetail}>
          <EditCard content={currentContent} onFinish={() => {
            setCurrentContent(undefined)
          }} />
          </div>}
        <div></div>
      </div>
    </div>
  )
}

export default Drives