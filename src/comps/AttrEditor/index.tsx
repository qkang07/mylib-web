import React, { useEffect, useMemo, useState } from 'react'
import { ContentAttr } from '../../types/content'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { Button, Input, InputNumber, Popconfirm, Select, Space } from '@douyinfe/semi-ui'
import { IconDelete, IconSave } from '@douyinfe/semi-icons'

type Props = {
  attr: ContentAttr
  onChange?: (attr: ContentAttr) => void
  onRemove?: () => void
}

const AttrEditor = (props: Props) => {

  const [attr, setAttr] = useState(props.attr)
  const [changed, setChanged] = useState(false)
  
  useEffect(() => {
    if(props.attr && JSON.stringify(props.attr) !== JSON.stringify(attr)) {
      setChanged(true)
    }
  }, [props.attr, attr])


  const {runAsync: doSave, loading: saveLoading} = useRequest(() => {
    return api.post('/content/attr', {
      ...attr
    }).then(() => {
      props.onChange?.(attr)
      setChanged(false)
    })
  }, {
    manual: true
  })
  const {runAsync: doDelete, loading: deleteLoading} = useRequest(() => {
    return api.delete('/content/attr', {}).then(() => {
      props.onRemove?.()
    })
  }, {  
    manual: true
  })


  const update = (value: Partial<ContentAttr>) => {
    setAttr({
      ...attr,
      ...value
    })
  }

  return (
    <Space spacing={4}>
      <Input size='small' style={{width: 100}} value={attr.Name} onChange={v => {
        update({
          Name: v
        })
      }} />
      <Select size='small' style={{width: 60}} showArrow={false} optionList={[
        {
          label: 'Text',
          value: 1
        },
        {
          label: 'Number',
          value: 2
        }
      ]} value={attr.Type}
        onChange={v => {
          const newAttr = {...attr}
          newAttr.Type = v as 1 | 2
          if(v === 1) {
            delete newAttr.NumValue
          } else {
            delete newAttr.StrValue
          }
          setAttr(newAttr)
        }}
      ></Select>
      {
        attr.Type === 1 ? <Input size='small' style={{width: 180}} value={attr.StrValue} onChange={v=> {
          update({
            StrValue: v
          })
        }} /> : <InputNumber size='small' style={{width: 180}} value={attr.NumValue} onChange={v => {
          update({
            NumValue: v as number
          })
        }} />
      }
        <Button size='small' type='primary' disabled={!changed} loading={saveLoading} onClick={() => doSave()} icon={<IconSave/>}></Button>
        <Popconfirm onConfirm={() => {
          doDelete()
        }}>
          <Button size='small' type='danger' loading={deleteLoading} icon={<IconDelete/>}></Button>

        </Popconfirm>

    </Space>
  )
}

export default AttrEditor