import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import { Button, Descriptions, Input, Popover, Select, Space, Table } from '@douyinfe/semi-ui'
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { CollectionNode, ConditionCollection, ContentModel } from '../../types/content'
import { Form, FormApi } from '@douyinfe/semi-ui/lib/es/form'
import { IconClose, IconPlus } from '@douyinfe/semi-icons'



type Props = {}


const Search = (props: Props) => {

  const formApi = useRef<FormApi>()

  const [condition, setCondition] = useState<ConditionCollection>({
    Type: 'and',
    Children: []
  })
  const updateConds = () => {

    setCondition({...condition})
  }
  const {data: result, loading, runAsync: doSearch} = useRequest(() => {
    return api.post<ContentModel[]>('/content/search', conds).then(res => res.data)
  }, {
    manual: true
  })

  const columns: ColumnProps[] = [
    {
      title: 'Name',
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
      <div className={styles.conditions}>
        <Form
        getFormApi={api => formApi.current = api}
        >

        </Form>
        {conds.map((cond, i) => {
          return <div key={i} className={styles.conditionCard}>
            <Input value={cond.Name} onChange={v => {
              cond.Name = v
              updateConds()
            }} />
            <Select optionList={OPTypes} value={cond.Operator} onChange={v => {
              cond.Operator = v as Operator
              updateConds()
            }} ></Select>
            <Input value={cond.Value} onChange={v => {
              cond.Value = v
              updateConds()
            }} />
            <Button icon={<IconClose/> } type='danger' size='small' onClick={() => {
              conds.splice(i, 1)
              updateConds()
            }} ></Button>
          </div>
        })}
        <Button icon={<IconPlus/> } size='small' onClick={() => {
          conds.push({
            Name: '',
            Operator: 'eq',
            Value: ''
          })
          updateConds()
        }}></Button>
      </div>
      <div className={styles.result} >
        <Table dataSource={result} loading columns={columns} ></Table>
      </div>
    </div>
  )
}

export default Search