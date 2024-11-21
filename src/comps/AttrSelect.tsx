import { Select, withField } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React from 'react'
import { api } from '../api'
import { AttrSchema } from '../types/content'
import { useAttrSchemas } from '../common/useAttrSchemas'

type Props = {
  value?: number
  removed?: (attr: AttrSchema) => boolean
  onChange?: (value?: number) => void
}

const AttrSelect = (props: Props) => {

  const {loading, data} = useRequest<AttrSchema[], []>(() => {
    return api.get('/attr/schema/list').then(res => res.data)
  })
  const {} = useAttrSchemas()
  return (
    <Select loading={loading} 
    value={props.value} 
    onChange={v => {
      props.onChange?.(v as number)
    }}
    optionList={data?.map(attr => {
      return {
        label: attr.Name,
        value: attr.ID,
        disabled: attr.ID !== props.value && props.removed?.(attr)
      }
    })} ></Select>
  )
}

export const FormAttrSelect = withField(AttrSelect)

export default AttrSelect