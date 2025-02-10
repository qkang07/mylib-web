import { ArrayField, Button, Descriptions, Form, Modal, Space, Toast } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AttrSchema, ContentAttr, ContentModel } from '../../types/content'
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

  const {data: attrs, loading: attrsLoading, runAsync: getAllAttrs} = useRequest(() => {
    return api.get('/content/attrs?id=' + content.ID).then(res => {
      if(res.data instanceof Array) {
        const attrs = res.data as ContentAttr[]
        if(!attrs.length) {
          attrs.push({
            Name:'',
            StrValue: '',
            Type: 1,
            ContentId: content.ID!
          })
        }
        formApi.current?.setValue('Attrs', attrs)
        return res.data
      }
      return []
    })
  },{
    manual: true,
    throttleWait: 500
  })

  useEffect(() => {
    if(content.ID) {
      getAllAttrs()
    }
  },[content.ID])

  const {runAsync: save, loading: attrLoading} = useRequest(() => {
    const attrs: ContentAttr[] = formApi.current?.getValues().Attrs || []
    content.Attrs = attrs.map(attr => {
      return attr?.Name + ':' + attr?.StrValue || attr.NumValue
    }).join('|')
    return api.post('content/attrs', content).then(res => res.data)
  }, {
    manual: true,
    onSuccess(){
      Toast.success('保存成功')
    }
  })

  // useEffect(() => {
  //   const attrs = content.Attrs?.split('|').map(attr => {
  //     const [name, value] = attr.split(':')
  //     return {
  //       Name: name,
  //       Value: value
  //     }
  //   }) || []
  //   formApi.current?.setValue('Attrs', attrs)
  // },[content.Attrs])


  const checkExistAttr = (attr: string) => {

    const attrs: ContentAttr[] = formApi.current?.getValue("Attrs")
    return attrs.some(a => a.Name === attr)
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
              <Form.Input field={`${item.field}.Name`} />
              {/* <FormAttrSelect label="Attribute" field={`${item.field}.Name`} removed={checkExistAttr} /> */}
              <Form.Input label="Value" field={`${item.field}.StrValue`} />
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