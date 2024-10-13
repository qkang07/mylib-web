import { ArrayField, Button, Descriptions, Form, Modal, Space } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconMinus, IconPlus } from '@douyinfe/semi-icons'

import React, { useEffect, useMemo, useRef } from 'react'
import { AttrModel, ContentModel } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { FormApi } from '@douyinfe/semi-ui/lib/es/form'
import styles from './index.module.scss'

type Props = {
  content?: ContentModel
  onFinish?: (res?: ContentModel) => void
}

const EditCard = (props: Props) => {
  const {content} = props
  const formApi = useRef<FormApi>() 

  useEffect(() => {

    if(content?.ID && !content.Attrs?.length) {
      content.Attrs = [
        {
          Name: '',
          Value: ''
        }
      ]
      formApi.current?.setValues(content)
    }
  }, [content])

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
    const values = formApi.current?.getValues()
    return api.post('/content/update_attr', values).then((res) => {
      props.onFinish?.(res.data)
    })
  }, {
    manual: true
  })


  return (
    <div className={styles.editCard}>
      <Form getFormApi={fapi => {
        formApi.current = fapi
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
        {/* <Form.Input label="" ></Form.Input> */}

        <ArrayField field='Attrs'>
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