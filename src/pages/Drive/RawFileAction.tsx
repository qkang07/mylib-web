import React, { useState } from 'react'
import { Button, Popover } from '@douyinfe/semi-ui'
import { IconCheckCircleStroked, IconFile, IconFolder, IconPlus } from '@douyinfe/semi-icons'
import EditCard from '../../comps/EditCard'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { ContentModel, FSContent } from '../../types/content'
import { findContentCategory } from '../../common/utils/content'

type Props = {
  fsContent: FSContent
  onUpdate?: (file: FSContent) => void
}

const RawFileAction = (props: Props) => {
  const fsContent = props.fsContent
  const [popVisible, setPopVisible] = useState(false)

  const {runAsync: addContent, loading: addLoading, data: addRes} = useRequest<ContentModel, void[]>(() => {
    const content = {
      ...fsContent,
      Type: 'file',
      Category: findContentCategory(fsContent),
    } as ContentModel
    return api.post('/content', content).then(res => { 
      return res.data 
    })
  }, {
    manual: true,
    onSuccess() {
      setPopVisible(true)
    }
  })

  const {runAsync: getContent, data: content} = useRequest(() => {
    return api.get('/content', {params: {id: fsContent.ContentId}}).then(res => res.data)
  }, {
    manual: true,
    onSuccess(){
      setPopVisible(true)
    }
  })

  const {runAsync: walkPath} =useRequest(() => {
    return api.get('/fs/walk?path=' + encodeURIComponent(fsContent.Path!)).then(res => res.data)
  }, {manual: true})

  if( fsContent.IsDir) {
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
        if(!fsContent.Exist) {
          addContent()
        } else {
          getContent()
        }
      }}>
        {fsContent.Exist ? '已收录' : '收录'}
      </Button> 
    </Popover>
  )
}

export default RawFileAction