import React, { useState } from 'react'
import { PathInfo } from '.'
import { Button, Popover } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { ContentModel } from '../../types/content'

type Props = {
  pathInfo: PathInfo
  onUpdate?: (file: PathInfo) => void
}

const RawFileAction = (props: Props) => {
  const info = props.pathInfo
  const [popVisible, setPopVisible] = useState(false)

  const {runAsync: addContent, loading: addLoading, data: addRes} = useRequest<ContentModel, void[]>(() => {
    return api.post('/content', info ).then(res => { 
      return res.data 
    })
  }, {
    manual: true,
    onSuccess() {
      setPopVisible(true)
    }
  })

  const {runAsync: getContent, data: content} = useRequest(() => {
    return api.get('/content', {params: {id: info.ContentId}}).then(res => res.data)
  }, {
    manual: true,
    onSuccess(){
      setPopVisible(true)
    }
  })

  const {runAsync: walkPath} =useRequest(() => {
    return api.get('/fs/walk?path=' + encodeURIComponent(info.Path!)).then(res => res.data)
  }, {manual: true})

  if( info.IsDir) {
    return <Button onClick={(e) => {
      e.stopPropagation()
      walkPath()
    }}>扫描</Button>
  }

  return (
    <Popover trigger='custom'  content={<EditCard content={addRes || content} onFinish={() => {
      setPopVisible(false)
    }} />} visible={popVisible} onClickOutSide={() => {
      setPopVisible(false)
    }}>
      <Button loading={addLoading} size='small' icon={<IconCheckCircleStroked/>} onClick={e => {
        e.stopPropagation()
        if(!info.Exist) {
          addContent()
        } else {
          getContent()
        }
      }}>
        {info.Exist ? '已收录' : '收录'}
      </Button> 
    </Popover>
  )
}

export default RawFileAction