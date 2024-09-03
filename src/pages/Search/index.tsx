import React, { useState } from 'react'
import styles from './index.module.scss'
import { Table } from '@douyinfe/semi-ui'

type Props = {}

const Index = (props: Props) => {

  const [conds, setConds] = useState([])

  return (
    <div>
      <div className={styles.conditions}></div>
      <div className={styles.result} >
        <Table>

        </Table>
      </div>
    </div>
  )
}

export default Index