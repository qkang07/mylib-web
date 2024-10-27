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
  // RefColl: number
  // RefCollProp: string

}

export type AttrModel = {
  Id?: number
  ContentId: number
  StringValue?: string
  NumberValue?: number
} & AttrSchema