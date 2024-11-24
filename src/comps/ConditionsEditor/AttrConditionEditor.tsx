import { Button, Input, InputNumber, Popover, Select, Space } from '@douyinfe/semi-ui'
import React, { useState } from 'react'
import AttrSelect from '../AttrSelect'
import { AttrSchema, ConditionOperator, ContentAttr, DirectCondition, OperatorTypes } from '../../types/content'
import { IconClose } from '@douyinfe/semi-icons'

type Props = {
  onChange?: (value: DirectCondition) => void
  value?: DirectCondition
  onRemove?: () => void
}

const AttrConditionEditor = (props: Props) => {


  const [attr, setAttr] = useState<AttrSchema>()
  const [cond, setCond] = useState<DirectCondition>(props.value || {
    Operator: '='
  } as DirectCondition)

  const onVisibleChange = (v: boolean) => {
    if(!v) {
      if(!cond.Attr || !cond.Operator || !cond.Values?.length) {
        props.onRemove?.()
      } else {
        props.onChange?.(cond)
      }
    }
  }

  const label = cond.Attr && cond.Operator && cond.Values?.length ? `${attr?.Label || ''} ${cond.Operator || ''} ${cond.Values?.[0] || ''}` : '请设置'
  return (
    <Popover position='bottomLeft' onVisibleChange={onVisibleChange} trigger='click' content={<div style={{padding: 10}}>
      <Space>
        <AttrSelect value={cond?.Attr} onChange={(id, a) => {
          setAttr(a)
          setCond({
            ...cond,
            Attr: id,
          })
        }
      }/>
        <Select showArrow={false} style={{minWidth: 80}} dropdownMatchSelectWidth value={cond.Operator} optionList={OperatorTypes.map(op => {
          return {
            value: op,
            label: op
          }
        })}
          onChange={v => {
            cond.Operator = v as ConditionOperator
            setCond({...cond})
          }}
        ></Select>
        {attr?.DataType === 1 ? <InputNumber value={cond.Values?.[0]} onChange={v => {
          cond.Values = [v]
          setCond({...cond})
        }}/> : <Input value={cond.Values?.[0]} onChange={v => {
          cond.Values = [v]
          setCond({...cond})
        }} />}
      </Space>
    </div>}>
      <Button style={{ display: 'inline-flex', justifyContent:'space-between'}} >
        <span> {label}</span>
       
        <Button size='small' icon={<IconClose/>} theme='borderless' onClickCapture={e => {
          e.stopPropagation()
          props.onRemove?.()
        }} ></Button>
      </Button>
    </Popover> 
  )
}

export default AttrConditionEditor