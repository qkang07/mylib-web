import { Button, Modal, Popconfirm, Space, Table, Toast } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React, { useState } from 'react'
import { api } from '../../api'
import { AttrSchema } from '../../types/content'
import AttrSchemaEditor from './Editor'

type Props = {}

const AttrSchemaList = (props: Props) => {

  const {data: schemaList = [], loading, runAsync: loadSchemas} = useRequest<AttrSchema[], []>(() => {
    return api.get('/attr/schema/list').then(res => res.data)
  })

  const {runAsync: delSchema} = useRequest((id: any) => {
    return api.delete('/attr/schema', {
      params: {
        id
      }
    }).then(res => res.data)
  }, {
    manual: true,
    onSuccess(){
      Toast.success('删除成功')
      loadSchemas()
    }
  })


  const [editVisible, setEditVisible] = useState(false)

  const [currentSchema, setCurrentSchema] = useState<AttrSchema>()
  

  return (
    <div>
      <Space>
        <Button onClick={() => {
          setCurrentSchema({
            Name: '',

          } as AttrSchema)
          setEditVisible(true)
        }} >添加</Button>
      </Space>
      <Table
      loading={loading}
      dataSource={schemaList}
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
                  setCurrentSchema(item)
                  setEditVisible(true)
                }} >编辑</Button>
                <Popconfirm onConfirm={() => {
                    delSchema(item.ID)

                }}>
                  <Button>删除</Button>
                </Popconfirm>
              </Space>
            }
          }
        ]}
      ></Table>
      <Modal footer={null} visible={editVisible}  onCancel={() =>setEditVisible(false)} 
        lazyRender
        >
          <AttrSchemaEditor attr={currentSchema} onChange={() => {
            loadSchemas()
            setEditVisible(false)
          }} />
        </Modal>
    </div>
  )
}

export default AttrSchemaList