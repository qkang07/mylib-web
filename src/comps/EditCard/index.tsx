import { ArrayField, Descriptions, Form, Modal } from '@douyinfe/semi-ui'
import React from 'react'
import { AttrModel, ContentModel } from '../../types/content'

type Props = {
  content: ContentModel
  attrs: AttrModel[]
}

const index = (props: Props) => {
  const {content, attrs} = props
  return (
    <div>
      <Form>
        <Form.Slot label="Name" >
          {content.Name}
        </Form.Slot>
        <Form.Slot label="Path" >
          {content.Path}
        </Form.Slot>
        <Form.Slot>
          {content.Size}
        </Form.Slot>
        {/* <Form.Input label="" ></Form.Input> */}
        <ArrayField>
          {({add, arrayFields}) => {
            arrayFields.map(item => {
              return <div>
                
              </div>
            })
          }}
        </ArrayField>
        {attrs.map(attr => {
          if(attr.DataType === 'number') {
            return <Form.InputNumber label={attr.Label} key={attr.Name} va />
          }
        })}
      </Form>
    </div>
  )
}

export default index