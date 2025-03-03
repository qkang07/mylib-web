import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import { Button, Descriptions, Input, Popover, Space, Table } from 'antd'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { CollectionNode, ConditionCollection, ContentModel } from '../../types/content'
import ConditionsEditor from '../../comps/ConditionsEditor'
import { ColumnsType } from 'antd/es/table'



type Props = {}


const Search = (props: Props) => {

  const [condition, setCondition] = useState<ConditionCollection>({
    Type: 'and',
    Children: []
  })

  const [keyword, setKeyword] = useState('')

  const {data: result, loading, runAsync: doSearch} = useRequest(() => {
    return api.post<ContentModel[]>('/content/search', condition).then(res => res.data.data)
  }, {
    manual: true
  })

  const columns: ColumnsType<ContentModel>[] = [
    {
      title : 'Name',
      dataIndex: 'Name'
    },
    {
      title: 'Size',
      dataIndex: 'Size'
    },
    {
      title: 'Type',
      dataIndex: 'Type'
    },
    {
      title: 'Actions',
      render(_, row, index) {
        return <Space>
          <Popover content={<div>
            <Descriptions></Descriptions>
          </div>}>
            <Button onClick={e => {
              e.stopPropagation()
            }}>Info</Button>
          </Popover>
          <Popover content={<EditCard content={row} />}>
            <Button>Attrs</Button>
          </Popover>
        </Space>
      }
    }
  ]

  return (
    <div>
      <div className={styles.searchInput}>
     <Input value={keyword} onChange={v => setKeyword(v)} allowClear/>
      </div>
      <div className={styles.conditions}>
        <ConditionsEditor className={styles.editor} initConditions={condition} onChange={(cond) => setCondition(cond)}/>
        <Button type='primary' onClick={() => doSearch()} >Search</Button>
      </div>
      <div className={styles.result} >
        <Table dataSource={result} loading={loading} columns={columns} ></Table>
      </div>
    </div>
  )
}

export default Search