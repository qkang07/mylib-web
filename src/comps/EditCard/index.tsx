import { ArrayField, Button, Descriptions, Form, Modal, Space } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AttrModel, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import styles from './index.module.scss'
import { FormAttrSelect } from '../AttrSelect'

type Props = {
  content?: ContentModel
  onFinish?: (res?: ContentModel) => void
}




const EditCard = (props: Props) => {
  const {content} = props
  const formApi = useRef<FormApi>() 

  useEffect(() => {
    
    setAttrs(content?.Attrs || [])
  }, [content?.Attrs])



  const [attrs, setAttrs] = useState<any[]>(content?.Attrs || [])

  // const {runAsync: addContent, loading: addLoading, data: addRes} = useRequest<ContentModel, void[]>(() => {
  //   return api.post('/content/add', content ).then(res => { 
  //     formApi.current?.setValues({
  //       Attrs: [
  //         {
  //           Name: '',
  //           Value: ''
  //         }
  //       ]
  //     })
  //     return res.data 
  //   })
  // }, {
  //   manual: true
  // })

  const {runAsync: saveAttrs, loading: attrLoading} = useRequest(() => {
    const attrs: AttrModel[] = formApi.current?.getValues().Attrs || []
    attrs.forEach(attr => {
      attr.ContentId = content!.ID!
      attr.DataType = 2
    })
    
    return Promise.all(attrs.map(attr => {
      return  api.post('/content/update_attr', attr)
    })).then((res) => {
      props.onFinish?.()
    })
  }, {
    manual: true
  })

  const addAttr = (index: number) => {
    attrs.splice(index, 0 , {
      Name: '',
      Value: '',

    })
    setAttrs([...attrs])
  }

  const removeAttr = (index: number) => {
    attrs.splice(index, 1)
    setAttrs([...attrs])
  }


  return (
    <div className={styles.editCard}>
      <Form getFormApi={fapi => {
        formApi.current = fapi
      }} initValues={{
        Attrs: []
      }}>
        <Form.Slot label="Name" >
          {content?.Name}
        </Form.Slot>
        <Form.Slot label="Path" >
          {content?.Path}
        </Form.Slot>
        <Form.Slot label="Size">
          {content?.Size}
        </Form.Slot>
        <Form.Input label="dsf" field='aaa'></Form.Input>
        {
          attrs.map((attr, index) => {
            return <Space key={index} style={{display: 'flex'}}>
              
              {/* <Form.Input field={`Attrs[${index}].AttrName`} /> */}
              <FormAttrSelect field={`Attrs[${index}].AttrName`} />
              <Form.Input field={`Attrs[${index}].StringValue`} />
              <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => addAttr(index + 1)} ></Button>
              <Button disabled={attrs.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => removeAttr(index)} ></Button>
            </Space>
          })
        }
        <div>
          <Button icon={<IconPlus/>} onClick={() => addAttr(0)}>添加</Button>
        </div>
        {/* <ArrayField field='Attrs' initValue={[{}]}>
          {({add, arrayFields}) => {
            return arrayFields.map(item => {
              return <Space key={item.key}>
                <Form.Input field={`${item.field}.Name`} placeholder={'Attr Name'} ></Form.Input>
                <Form.Input field={`${item.field}.Value`} placeholder={'Value'} ></Form.Input>
                <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => add()} ></Button>
                <Button disabled={arrayFields.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => item.remove()} ></Button>
              </Space>
            })
          }}
        </ArrayField> */}
      </Form>
      <Space>
        <Button theme='solid' loading={attrLoading} onClick={() => {
          saveAttrs()
        }}  >保存</Button>
        <Button onClick={() => {
          props.onFinish?.()
        }}>完成</Button>
      </Space>
    </div>
  )
}

export default EditCard