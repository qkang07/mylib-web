import React, { useEffect, useRef } from 'react'
import { AttrSchema } from '../../types/content'
import { Button, Form, Modal, Space, Spin } from '@douyinfe/semi-ui'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import { useRequest } from 'ahooks'
import { api } from '../../api'

type Props = {
  attr?: AttrSchema
  onChange? : () => void
}

const AttrSchemaEditor = (props: Props) => {

  const formApi = useRef<FormApi>() 

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

        <Form getFormApi={fapi => {
          formApi.current = fapi
        }}>
          <Form.Input label="Name" field='Name' />
          <Form.Input label="Label" field='Label' />
          <Form.RadioGroup field='DataType'>
            <Form.Radio value={2} >字符串</Form.Radio>
            <Form.Radio value={1} >数字</Form.Radio>
          </Form.RadioGroup>
          <Form.TextArea field='Config'></Form.TextArea>
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