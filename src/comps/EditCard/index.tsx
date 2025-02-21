import { ArrayField, Button, Descriptions, Form, Input, Modal, Popconfirm, Space, Spin, Toast } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AttrSchema, ContentAttr, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import styles from './index.module.scss'
import { FormAttrSelect } from '../AttrSelect'
import AttrEditor from '../AttrEditor'

type Props = {
  content: ContentModel
  onFinish?: (res?: ContentModel) => void
}




const EditCard = (props: Props) => {
  const {content} = props
  const formApi = useRef<FormApi>() 

  const {data: attrs = [], loading: attrsLoading, runAsync: getAllAttrs, mutate: mutateAttrs} = useRequest(() => {
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
    console.log('each time', content.ID)
    if(content.ID) {
      getAllAttrs()
    }
  },[content.ID])
  useEffect(() => {
    console.log('edit card init')
  }, [])


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


  // const checkExistAttr = (attr: string) => {

  //   const attrs: ContentAttr[] = formApi.current?.getValue("Attrs")
  //   return attrs.some(a => a.Name === attr)
  // }


  return (
    <div className={styles.editCard}>
      <Descriptions data={[
        {
          key: 'Name',
          value: content.Name
        },
        {
          key:'Path',
          value: content.Path,
        },
        {
          key: 'Size',
          value: content.Size
        }
      ]} >

      </Descriptions>
      <div className={styles.attrs}>
        <Spin spinning={attrLoading}>

          {
            attrs?.map((attr, index) => {
              return <div key={index} style={{marginTop: 8}}>
                <AttrEditor attr={attr}
              onRemove={() => {
                attrs.splice(index, 1)
                mutateAttrs([...attrs])
              }}
              />
              </div>
            })
          }
          <div style={{marginTop: 8}}>
            <Button size='small' icon={<IconPlus/>} block onClick={() => {
              const attr: ContentAttr = {
                Name:'',
                StrValue: '',
                Type: 1,
                ContentId: content.ID!
              }
              attrs.push(attr)
              mutateAttrs([...attrs])
            }} ></Button>
          </div>
        </Spin>
      </div>
      {/* <Form getFormApi={fapi => {
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
              <FormAttrSelect label="Attribute" field={`${item.field}.Name`} removed={checkExistAttr} />
              <Form.Input label="Value" field={`${item.field}.StrValue`} />
              <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => add()} ></Button>
              <Popconfirm onConfirm={() => {

              }}>
                <Button disabled={arrayFields.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => item.remove()} ></Button>
              </Popconfirm>
            </Space>
            })
          }}
        </ArrayField>
      </Form> */}
      <Space style={{marginTop: 8}}>
        {/* <Button theme='solid' loading={attrLoading} onClick={() => {
          save()
        }}  >保存</Button> */}
        <Button onClick={() => {
          props.onFinish?.()
        }}>完成</Button>
      </Space>
    </div>
  )
}

export default EditCard