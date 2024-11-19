export type ModelBase = {
  ID?: number
  CreatedAt?: string
  UpdatedAt?: string
  DeletedAt?: string
}

export type ContentModel = {
  Name: string
  Path: string 
  Size: string
  Type: number
  Content?: string
  Hash: string
  MimeType?: string
  Unavailable?: number
  Attrs?: AttrModel[]
} & ModelBase

export type ContentType = {
  Name: string
  MimeType?: string
  Ext?: string
  // BaseType?: number
  Attrs: string
} & ModelBase

export type AttrSchema = {
  ID: number
  Name: string
  Label?: string
  DataType: 1 | 2 // 1 number 2 string
  Config?: string
  // RefColl: number
  // RefCollProp: string

}

export type ContentAttr = {
  ID: number
  ContentId: number
  Value: string
  Label: string
  Name: string
  NumberValue: number
  SchemaId: number
  DataType: number
}

export type AttrModel = {
  ID?: number
  ContentId: number
  Value?: string
  NumberValue?: number
  SchemaId?: number
  SchemaInfo?: AttrSchema
}




export type ConditionOperator = 'eq' | 'lt' |'gt'|'le'|'ge'|'not'|'in'|'notin'|'between' | 'exist' | 'not_exist'

export const OperatorTypes: {
  name: string,
  value: ConditionOperator
}[] = [
  {name: '=', value: 'eq'},
  {name: '<', value: 'eq'},
  {name: '>', value: 'eq'},
  {name: '<=', value: 'eq'},
  {name: '>=', value: 'eq'},
  {name: '!=', value: 'eq'},
  {name: 'in', value: 'eq'},
  {name: 'not in', value: 'notin'},
  {name: 'between', value: 'between'},
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

