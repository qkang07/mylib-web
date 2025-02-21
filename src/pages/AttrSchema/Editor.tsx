import React, { useEffect, useRef } from 'react'
import { AttrSchema } from '../../types/content'
import { Button, Form, Input, Radio, Space, Spin } from 'antd'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import { useRequest } from 'ahooks'
import { api } from '../../api'

type Props = {
  attr?: AttrSchema
  onChange? : () => void
}

const AttrSchemaEditor = (props: Props) => {

  const formApi = useRef<FormApi>() 
  const [form] = Form.useForm()

  useEffect(() => {
    if(props.attr) {
      formApi.current?.setValues(props.attr)
    }
  }, [props.attr])

  const {runAsync: createSchema, loading: createLoading} = useRequest(() => {
    const data = formApi.current?.getValues()
    return api.post('/attr/schema', data).then(res => res.data)
  }, {
    manual: true,
    onSuccess() {
      props.onChange?.()
    }
  })


  return (
    <div>
      <Spin spinning={createLoading}>

        <Form form={form} >
          <Form.Item label="Name" name='Name' >
            <Input/>
          </Form.Item>
          <Form.Item label="Label" name='Label' >
            <Input/>
          </Form.Item>
          <Form.Item name={'DataType'}>
            <Radio.Group >
              <Radio value={2} >字符串</Radio>
              <Radio value={1} >数字</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={'Config'}>
            <Input.TextArea></Input.TextArea>
          </Form.Item>
        </Form>
        <Space>
          <Button onClick={() => {
            createSchema()
          }} >保存</Button>
        </Space>
      </Spin>
    </div>
  )
}

export default AttrSchemaEditor