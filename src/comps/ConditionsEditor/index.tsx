import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { ConditionCollection } from '../../types/content'
import styles from './index.module.less'

type Props = {
  initConditions?: ConditionCollection
  onChange?: (conditions: ConditionCollection) => void
}

type ConditionsEditorRef = {
  updateConditions: (conditions: ConditionCollection) => void
  reset: () => void
}

const ConditionsEditor = forwardRef<ConditionsEditorRef, Props>((props, ref) => {

  const [conditions, setConditions] = useState<ConditionCollection | undefined >(props.initConditions)

  useEffect(() => {
    if(props.initConditions && !conditions) {
      setConditions(props.initConditions)
    }
  }, [props.initConditions])

  const updateConditions = (conds: ConditionCollection) => {

  }

  const reset = () => {

  }
  useImperativeHandle(ref, () => {
    return {
      updateConditions,
      reset
    }
  })


  return (
    <div className={styles.conditionsEditor}>
      {}
    </div>
  )
})

export default ConditionsEditor