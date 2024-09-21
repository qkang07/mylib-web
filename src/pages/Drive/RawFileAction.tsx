import React, { useState } from 'react'
import { PathInfo } from '.'
import { Button, Popover } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'

type Props = {
  file: PathInfo
}

const RawFileAction = (props: Props) => {
  const file = props.file
  const [popVisible, setPopVisible] = useState(false)
  const {runAsync: doAdd, loading: addLoading, data: content } = useRequest(() => {
    return api.post('/content/add', file)
  })

  return (
    <Popover content={<EditCard content={content} />} visible={popVisible} onClickOutSide={() => {
      setPopVisible(false)
    }}>

{
          file.Exist ? <Button size='small' icon={<IconCheckCircleStroked/>} onClick={e => {
            e.stopPropagation()
          }}>
              已收录
          </Button> : <Button size='small' theme='solid' icon={<IconPlus/>} onClick={e => {
          e.stopPropagation()
          doAdd()
        }} loading={addLoading} >收录</Button>
        }
    </Popover>
  )
}

export default RawFileAction