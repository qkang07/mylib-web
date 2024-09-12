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
  Name: string
  Label: string
  DataType: 'number' | 'string'
  // RefColl: number
  // RefCollProp: string

}

export type AttrModel = {
  Value: string
} & AttrSchema