import React, { useState } from 'react'
import styles from './index.module.scss'
import { Button, Descriptions, Input, Popover, Select, Space, Table } from '@douyinfe/semi-ui'
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table'
import EditCard from '../../comps/EditCard'


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

  const [conds, setConds] = useState<Condition[]>([])

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
        {conds.map((cond, i) => {
          return <div key={i} className={styles.conditionCard}>
            <Input value={cond.Name} />
            <Select></Select>
            <Input/>
          </div>
        })}
      </div>
      <div className={styles.result} >
        <Table   ></Table>
      </div>
    </div>
  )
}

export default Search