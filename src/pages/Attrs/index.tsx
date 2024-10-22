import { Table } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React from 'react'
import { api } from '../../api'

type Props = {}

const Attrs = (props: Props) => {

  const {data: attrList, loading, runAsync: loadAttrs} = useRequest(() => {
    return api.get('/attrs').then(res => res.data)
  })
  return (
    <div>
      <Table
      dataSource={attrList}
        columns={[
          {
            dataIndex: 'Name',
            title: 'Name'
          },
          {
            dataIndex: 'Label',
            title: 'Label'
          },
          {
            dataIndex: 'DataType',
            title: 'DataType',
            render: (text) => {
              return text === 1 ? 'Number' : 'String'
            }
          },
        ]}
      ></Table>
    </div>
  )
}

export default Attrs