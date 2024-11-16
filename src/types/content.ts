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