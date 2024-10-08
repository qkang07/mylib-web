import React, { useState } from 'react'
import { PathInfo } from '.'
import { Button, Popover } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'

type Props = {
  pathInfo: PathInfo
  onUpdate?: (file: PathInfo) => void
}

const RawFileAction = (props: Props) => {
  const info = props.pathInfo
  const [popVisible, setPopVisible] = useState(false)

  const {runAsync: addContent, loading: addLoading, data: addRes} = useRequest<ContentModel, void[]>(() => {
    return api.post('/content/add', info ).then(res => { 
      return res.data 
    })
  }, {
    manual: true,
    onSuccess() {
      setPopVisible(true)
    }
  })

  

  return (
    <Popover  content={<EditCard content={addRes} onFinish={() => {
      setPopVisible(false)
    }} />} visible={popVisible} onClickOutSide={() => {
      setPopVisible(false)
    }}>
      <Button loading={addLoading} size='small' icon={<IconCheckCircleStroked/>} onClick={e => {
        e.stopPropagation()
        if(info.Exist) 
        addContent()
      }}>
        {info.Exist ? '已收录' : '收录'}
      </Button> 
    </Popover>
  )
}

export default RawFileAction