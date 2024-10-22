import { Button, Space, Table } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React from 'react'
import { api } from '../../api'

type Props = {}

const AttrSchema = (props: Props) => {

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

          {
            title: 'Actions',
            render: (v, item) => {
              return <Space>

                <Button onClick={() => {

                }} >编辑</Button>
                <Button onClick={() => {

                }}>删除</Button>
              </Space>
            }
          }
        ]}
      ></Table>
    </div>
  )
}

export default AttrSchema