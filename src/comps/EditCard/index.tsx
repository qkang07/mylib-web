import { ArrayField, Button, Descriptions, Form, Modal, Space } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AttrModel, AttrSchema, ContentAttr, ContentModel } from '../../types/content'
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

  // useEffect(() => {
    
  //   setAttrs(content?.Attrs || [])
  // }, [content?.Attrs])



  // const [attrs, setAttrs] = useState<any[]>(content?.Attrs || [])

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

  const {data: attrs = [], loading: getAttrLoading, mutate: mutateAttrs} = useRequest(() => {
    return api.get<Partial<ContentAttr>[]>('/content/attrs', {
      params: {
        id: content?.ID
      }
    }).then(res => res.data || [])
  }, {
    refreshDeps: [content?.ID],
    debounceWait: 100
  })

  const {runAsync: saveAttrs, loading: attrLoading} = useRequest(() => {
    const newAttrs: AttrModel[] = formApi.current?.getValues().Attrs || []
    const promises: Promise<void>[] = []
    attrs.forEach(attr => {
      const na = newAttrs.find(a => a.ID === attr.ID)
      if(!na) {
        promises.push(api.delete('/content/attr?id=' + attr.ID))
      } else {

        na.ContentId = content!.ID!
        na.NumberValue = 0
        promises.push(api.post('/content/attr', na))
      }
    })
    Promise.all(promises).then(() => {
      props.onFinish?.()
    })
  }, {
    manual: true
  })

  useEffect(() => {
    formApi.current?.setValue('Attrs', attrs)
  },[attrs])

  // const addAttr = (index: number) => {
  //   attrs.splice(index, 0 ,  {
  //     ContentId: content!.ID as number
  //   })
  //   mutateAttrs([...attrs])
  // }

  // const removeAttr = (index: number) => {
  //   attrs.splice(index, 1)
  //   mutateAttrs([...attrs])
  // }

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
          {content?.Name}
        </Form.Slot>
        <Form.Slot label="Path" >
          {content?.Path}
        </Form.Slot>
        <Form.Slot label="Size">
          {content?.Size}
        </Form.Slot>
        {/* {
          attrs.map((attr, index) => {
            return <Space key={index} style={{display: 'flex'}}>
              
              <FormAttrSelect field={`Attrs[${index}].SchemaId`} />
              <Form.Input field={`Attrs[${index}].Value`} />
              <Button circle icon={<IconPlus/> } theme='borderless' onClick={() => addAttr(index + 1)} ></Button>
              <Button disabled={attrs.length <= 1} circle icon={<IconMinus/> } theme='borderless' onClick={() => removeAttr(index)} ></Button>
            </Space>
          })
        } */}
        {/* <div>
          <Button icon={<IconPlus/>} onClick={() => addAttr(0)}>添加</Button>
        </div> */}
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