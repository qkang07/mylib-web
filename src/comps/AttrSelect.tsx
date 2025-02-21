import { Select, withField } from '@douyinfe/semi-ui'
import React from 'react'
import { useAttrSchemas } from '../common/useAttrSchemas'

type Props = {
  value?: string
  removed?: (attr: string) => boolean
  onChange?: (value: string) => void
}

const AttrSelect = (props: Props) => {

  // const {loading, data} = useRequest<AttrSchema[], []>(() => {
  //   return api.get('/attr/schema/list').then(res => res.data)
  // })
  const {attrSchemas, loading} = useAttrSchemas()
  return (
    <Select style={{minWidth:60}} loading={loading} 
    allowCreate
    value={props.value} 
    onChange={v => {
      props.onChange?.(v as string)
    }}
    optionList={attrSchemas?.map(attr => {
      return {
        label: attr.Label || attr.Name,
        value: attr.Name,
        disabled: attr.Name !== props.value && props.removed?.(attr.Name)
      }
    })} ></Select>
  )
}

export const FormAttrSelect = withField(AttrSelect)

export default AttrSelect