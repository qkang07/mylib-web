import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import { Button, Descriptions, Input, Popover, Select, Space, Table } from '@douyinfe/semi-ui'
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { ContentModel } from '../../types/content'
import { Form, FormApi } from '@douyinfe/semi-ui/lib/es/form'


type Operator = 'eq' | 'lt' |'gt'|'le'|'ge'|'not'|'in'|'notin'|'between'

const OPTypes: {
  Name: string,
  Value: Operator
}[] = [
  {Name: '=', Value: 'eq'},
  {Name: '<', Value: 'eq'},
  {Name: '>', Value: 'eq'},
  {Name: '<=', Value: 'eq'},
  {Name: '>=', Value: 'eq'},
  {Name: '!=', Value: 'eq'},
  {Name: 'in', Value: 'eq'},
  {Name: 'not in', Value: 'notin'},
  {Name: 'between', Value: 'between'},
]

type Condition = {
  Name: string
  Operator: Operator
  Values: (string | number)[]
}



type Props = {}


const Search = (props: Props) => {

  const formApi = useRef<FormApi>()

  const [conds, setConds] = useState<Condition[]>([])
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
            <Input value={cond.Name} />
            <Select></Select>
            <Input/>
          </div>
        })}
      </div>
      <div className={styles.result} >
        <Table dataSource={result} loading columns={columns} ></Table>
      </div>
    </div>
  )
}

export default Search