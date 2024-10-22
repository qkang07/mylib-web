import React, { useRef } from 'react'
import { AttrSchema } from '../../types/content'
import { Button, Form, Modal, Space } from '@douyinfe/semi-ui'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import { useRequest } from 'ahooks'
import { api } from '../../api'

type Props = {
  attr?: AttrSchema
}

const AttrSchemaEditor = (props: Props) => {

  const formApi = useRef<FormApi>() 

  const {} = useRequest(() => {
    return api.post('/attr')
  })


  return (
    <div>
      <Form getFormApi={fapi => {
        formApi.current = fapi
      }}>
        <Form.Input label="Name" field='Name' />
        <Form.Input label="Label" field='Label' />
        <Form.RadioGroup field='DataType'>
          <Form.Radio value={1} label="数字"></Form.Radio>
          <Form.Radio value={2} label="字符串"></Form.Radio>
        </Form.RadioGroup>
      </Form>
      <Space>
        <Button onClick={() => {}} >保存</Button>
      </Space>
    </div>
  )
}

export default AttrSchemaEditor