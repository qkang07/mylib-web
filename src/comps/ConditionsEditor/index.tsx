import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ConditionCollection, DirectCondition } from '../../types/content'
import styles from './index.module.scss'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Popover, Select, Space, Tag } from '@douyinfe/semi-ui'
import AttrSelect from '../AttrSelect'
import { Input } from '@douyinfe/semi-ui/lib/es/input'
import AttrConditionEditor from './AttrConditionEditor'

type Props = {
  initConditions?: ConditionCollection
  onChange?: (conditions: ConditionCollection) => void
  className?: string
}

type ConditionsEditorRef = {
  updateConditions: (conditions: ConditionCollection) => void
  reset: () => void
}

const ConditionsEditor = forwardRef<ConditionsEditorRef, Props>((props, ref) => {

  const [conditions, setConditions] = useState<ConditionCollection >(props.initConditions || {
    Type:'and',
    Children: []
  })

  useEffect(() => {
    if(props.initConditions && !conditions) {
      setConditions(props.initConditions)
    }
  }, [props.initConditions])



  const reset = () => {
    conditions.Children?.splice(0)
    setConditions({...conditions})
    props.onChange?.(conditions)
  }
  useImperativeHandle(ref, () => {
    return {
      updateConditions(conds: ConditionCollection) {
        setConditions({...conds})
      },
      reset
    }
  })


  return (
    <Space wrap className={`${props.className || ''}`}>
      {(conditions?.Children as DirectCondition[]).map((cond, index) => {
        return <AttrConditionEditor key={index} value={cond} onChange={(v) => {
          conditions.Children![index] = v
          setConditions({...conditions})
          props.onChange?.(conditions)
          
        }} 
        onRemove={() => {
          conditions.Children?.splice(index, 1)
          setConditions({...conditions})
        }}
        />
      })}
      <Button icon={<IconPlus/>} onClick={() => {
        conditions.Children?.push({} as DirectCondition)
        setConditions({...conditions})
      }}></Button>
    </Space>
  )
})

export default ConditionsEditor