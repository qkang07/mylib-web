import { Select, withField } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React from 'react'
import { api } from '../api'
import { AttrSchema } from '../types/content'

type Props = {
  value?: number
  onChange?: (value?: number) => void
}

const AttrSelect = (props: Props) => {
  const {loading, data} = useRequest<AttrSchema[], []>(() => {
    return api.get('/attr/schema/list').then(res => res.data)
  })
  return (
    <Select loading={loading} 
    value={props.value} 
    onChange={v => {
      props.onChange?.(v as number)
    }}
    optionList={data?.map(attr => {
      return {
        label: attr.Name,
        value: attr.ID
      }
    })} ></Select>
  )
}

export const FormAttrSelect = withField(AttrSelect)

export default AttrSelect