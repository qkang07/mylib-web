export type ModelBase = {
  ID?: number
  CreatedAt?: string
  UpdatedAt?: string
  DeletedAt?: string
}

// 文件系统的模型
export interface FSContent  {
  Name: string
  IsDir: boolean
  Size?: number
  Exist?: boolean
  Path?: string
  // 如果是已存在的内容，会有 contentid
  ContentId?: number
}

export type ContentType = 'text' | 'file' | 'collection' | 'link' | 'empty'

export type ContentCategory =  'text' | 'image' |'video' |'audio' |'doc' | 'pkg'|'install' | 'code' |'exe' |'unknown'

export type ContentModel = {
  Name: string
  Path?: string 
  Size?: string
  Type?: ContentType
  Category?: ContentCategory
  Content?: string
  Hash?: string
  MimeType?: string
  Annotation?: string
  Unavailable?: number
  Attrs?: string
} & ModelBase

// export type ContentType = {
//   Name: string
//   MimeType?: string
//   Ext?: string
//   // BaseType?: number
//   Attrs: string
// } & ModelBase

export type AttrSchema = {
  ID: number
  Name: string
  Label?: string

  Config?: string
  // RefColl: number
  // RefCollProp: string

}

export type ContentAttr = {
  ID: number
  ContentId: number
  Label: string
  Name: string
  StrValue: string
  NumValue: number
  SchemaId: number
  Type: number
}




export type ConditionOperator =   '=' | '>' | '<' | '>=' | '<=' | 'not' | 'in' | 'not_in' | 'between' | 'exist' | 'not_exist'

export const OperatorTypes: string[] = [
  '=', '>', '<', '>=', '<=', 'not', 'in', 'not_in', 'between', 'exist', 'not_exist'
]


export type DirectCondition = {
  Attr: number // attr schema id
  Operator: ConditionOperator
  Values?: (string | number)[]
}

export type ConditionCollection = {
  Type: 'and' | 'or' | 'not'
  Children?: (DirectCondition | ConditionCollection)[]
}

