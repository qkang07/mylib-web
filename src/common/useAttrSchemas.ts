import { useMemo, useRef, useState } from "react"
import { AttrSchema } from "../types/content"
import { useRequest } from "ahooks"
import { api } from "../api"



export const useAttrSchemas = () => {
  const schemaMap = useRef(new Map<number, AttrSchema>())
  const {runAsync: reloadAttrSchemas, data: attrSchemas = [], loading} = useRequest(() => {
    return api.get<AttrSchema[]>('/attr/schema/list').then(res => {
      const attrs = res.data
      attrs.forEach(attr => {
        schemaMap.current.set(attr.ID, attr)
      })
      return attrs
    })
  }, {})

  return {
    attrSchemas,
    loading,
    reloadAttrSchemas,
    getById(id: number) {
      return schemaMap.current.get(id)
    },
    getByName(name: string) {
      return attrSchemas.find(attr => attr.Name === name)
    }
  }
}