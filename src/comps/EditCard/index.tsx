import { ArrayField, Button, Descriptions, Form, Modal, Space } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useRef } from 'react'
import { AttrModel, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'

type Props = {
  content: ContentModel
  onFinish?: (res?: ContentModel) => void
}

const EditCard = (props: Props) => {
  const {content} = props
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
        <ArrayField field='Attrs'>
          {({add, arrayFields}) => {
            return arrayFields.map(item => {
              return <Space key={item.key}>
                <Form.Input field={`${item.field}.Name`} placeholder={'Attr Name'} ></Form.Input>
                <Form.Input field={`${item.field}.Value`} placeholder={'Value'} ></Form.Input>
                <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => add()} ></Button>
                <Button circle icon={<IconMinus/> } theme='borderless' onClick={() => item.remove()} ></Button>
              </Space>
            })
          }}
        </ArrayField>
      </Form>
      <Space>
        <Button theme='solid' loading={saveLoading} onClick={() => {
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