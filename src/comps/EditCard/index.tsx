import { ArrayField, Button, Descriptions, Form, Modal, Space, Toast } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AttrModel, AttrSchema, ContentAttr, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import styles from './index.module.scss'
import { FormAttrSelect } from '../AttrSelect'

type Props = {
  content: ContentModel
  onFinish?: (res?: ContentModel) => void
}




const EditCard = (props: Props) => {
  const {content} = props
  const formApi = useRef<FormApi>() 


  const {runAsync: save, loading: attrLoading} = useRequest(() => {
    const attrs: AttrModel[] = formApi.current?.getValues().Attrs || []
    content.Attrs = attrs.map(attr => {
      return attr.SchemaInfo?.Name + ':' + attr.Value
    }).join('|')
    return api.post('content/attrs', content).then(res => res.data)
  }, {
    manual: true,
    onSuccess(){
      Toast.success('保存成功')
    }
  })

  useEffect(() => {
    const attrs = content.Attrs?.split('|').map(attr => {
      const [name, value] = attr.split(':')
      return {
        Name: name,
        Value: value
      }
    }) || []
    formApi.current?.setValue('Attrs', attrs)
  },[content.Attrs])


  const checkExistAttr = (attr: AttrSchema) => {

    const attrs: ContentAttr[] = formApi.current?.getValue("Attrs")
    return attrs.some(a => a.SchemaId === attr.ID)
  }


  return (
    <div className={styles.editCard}>
      <Form getFormApi={fapi => {
        formApi.current = fapi
      }} allowEmpty initValues={{
        Attrs: []
      }}>
        <Form.Slot label="Name" >
          {content.Name}
        </Form.Slot>
        <Form.Slot label="Path" >
          {content.Path}
        </Form.Slot>
        <Form.Slot label="Size">
          {content.Size}
        </Form.Slot>
        <ArrayField field='Attrs'>
          {({arrayFields, add}) => {
            
            return arrayFields.map(item => {
              return <Space key={item.key} style={{display: 'flex'}}>
              {/* <Form.Input field={`Attrs[${index}].AttrName`} /> */}
              <FormAttrSelect label="Attribute" field={`${item.field}.SchemaId`} removed={checkExistAttr} />
              <Form.Input label="Value" field={`${item.field}.Value`} />
              <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => add()} ></Button>
              <Button disabled={arrayFields.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => item.remove()} ></Button>
            </Space>
              // return <Space key={item.key}>
              //   <Form.Input field={`${item.field}.Name`} placeholder={'Attr Name'} ></Form.Input>
              //   <Form.Input field={`${item.field}.Value`} placeholder={'Value'} ></Form.Input>
              //   <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => add()} ></Button>
              //   <Button disabled={arrayFields.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => item.remove()} ></Button>
              // </Space>
            })
          }}
        </ArrayField>
      </Form>
      <Space>
        <Button theme='solid' loading={attrLoading} onClick={() => {
          save()
        }}  >保存</Button>
        <Button onClick={() => {
          props.onFinish?.()
        }}>完成</Button>
      </Space>
    </div>
  )
}

export default EditCard