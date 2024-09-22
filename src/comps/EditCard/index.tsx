import { ArrayField, Button, Descriptions, Form, Modal, Space } from '@douyinfe/semi-ui'
import React, { useRef } from 'react'
import { AttrModel, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'

type Props = {
  content: ContentModel
  attrs?: AttrModel[]
  onFinish?: (res?: ContentModel) => void
}

const EditCard = (props: Props) => {
  const {content, attrs} = props
  const formApi = useRef<FormApi>() 

  const {runAsync: saveAttrs, loading: saveLoading} = useRequest(() => {
    const values = formApi.current?.getValues()
    return api.post('/content/update_attr', values).then((res) => {
      props.onFinish?.(res.data)
    })
  })

  return (
    <div>
      <Form getFormApi={fapi => {
        formApi.current = fapi
      }}>
        <Form.Slot label="Name" >
          {content.Name}
        </Form.Slot>
        <Form.Slot label="Path" >
          {content.Path}
        </Form.Slot>
        <Form.Slot>
          {content.Size}
        </Form.Slot>
        {/* <Form.Input label="" ></Form.Input> */}
        <ArrayField>
          {({add, arrayFields}) => {
            arrayFields.map(item => {
              return <div key={item.key}>
                
              </div>
            })
          }}
        </ArrayField>
        {attrs.map(attr => {
          if(attr.DataType === 'number') {
            return <Form.InputNumber label={attr.Label} key={attr.Name} va />
          }
        })}
      </Form>
      <Space>
        <Button theme='solid' onClick={() => {
          saveAttrs()
        }} >保存</Button>
        <Button onClick={() => {
          props.onFinish?.()
        }}>取消</Button>
      </Space>
    </div>
  )
}

export default EditCard