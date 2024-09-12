import React from 'react'
import styles from './index.module.scss'
import { ContentModel } from '../../types/content'
import { Button, Space, Tag } from '@douyinfe/semi-ui'


type Props = {
  content: ContentModel
}

const ContentCard = (props: Props) => {
  const {content} = props
  return (
    <div className={styles.contentCard}>
      <div className={styles.contentImg}>
        <img/>
      </div>
      <div className={styles.contentInfo}>
        <div>{content.Name}</div>
        <div className={styles.basicInfo}>
          <Space>
            <span>{content.Size} byte</span>
            <span>{content.Type} {content.MimeType}</span>
            <span>Path: {content.Path}</span>
          </Space>
        </div>
        <div className={styles.attrs}>
          <Space wrap>

          {content.Attrs?.map(attr => {
            return <Tag>{attr.Name}: {attr.Value}</Tag>
          })}
          <Button size='small'>Add</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default ContentCard