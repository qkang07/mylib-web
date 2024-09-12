import React, { useState } from 'react'
import styles from './index.module.scss'
import { Input, Select, Table } from '@douyinfe/semi-ui'


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


const Index = (props: Props) => {

  const [conds, setConds] = useState<Condition[]>([])

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
      
      </div>
    </div>
  )
}

export default Index