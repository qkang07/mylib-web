import React, { useState } from 'react'
import { Button } from 'antd'
import { IconCheckCircleStroked } from '@douyinfe/semi-icons'
import { useRequest } from 'ahooks'
import { api } from '../../api'
import { ContentModel, FSContent } from '../../types/content'
import { findContentCategory } from '../../common/utils/content'

type Props = {
  fsContent: FSContent
  onUpdate?: (file: FSContent) => void
  onSelect?: (content: ContentModel) => void
}

const RawFileAction = (props: Props) => {
  const fsContent = props.fsContent
  // const [popVisible, setPopVisible] = useState(false)

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
    onSuccess(res) {
      // setPopVisible(true)
      props.onSelect?.(res)

    }
  })

  const {runAsync: getContent, data: content, loading: getLoading} = useRequest(() => {
    return api.get('/content', {params: {id: fsContent.ContentId}}).then(res => res.data)
  }, {
    manual: true,
    onSuccess(res){
      // setPopVisible(true)
      props.onSelect?.(res)
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

    <Button loading={addLoading || getLoading} size='small' icon={<IconCheckCircleStroked/>} onClick={e => {
      e.stopPropagation()
      if(!fsContent.Exist) {
        addContent()
      } else {
        getContent()
      }
    }}>
      {fsContent.Exist ? '已收录' : '收录'}
    </Button> 
  )
}

export default RawFileAction