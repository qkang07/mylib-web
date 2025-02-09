import { ContentCategory } from "../../types/content"

const ExtCatDict: {
  cat: ContentCategory,
  exts: string[]
}[] = [
  {
    exts: ['zip','7z','rar','tar','gz'],
    cat: 'pkg'
  },
  {
    exts: ['jpg','jpeg','png','bmp','gif','webp','svg'],
    cat: 'image'
  },
  {
    exts: ['txt'],
    cat: 'text'
  },
  {
    exts: ['js','ts','py','json','html','css','java','cpp','c','go','tsx','jsx','vue','scss','less','sql'],
    cat: 'code'
  },
  {
    exts: ['doc','docx','pdf','xls','xlsx','ppt','pptx','md'],
    cat: 'doc'
  },
  {
    exts: ['mp4','rmvb','avi','flv','mpeg'],
    cat: 'video'
  },
  {
    exts: ['mp3'],
    cat: 'audio'
  }
]

const ExtCatMap: Record<string, ContentCategory> = {}
ExtCatDict.forEach(cat => {
  cat.exts.forEach(ext => {
    ExtCatMap[ext] = cat.cat
  })
})

export const findContentCategory = (content: {
  Name: string
}) => {
  const ext = content.Name.split('.').pop()?.toLowerCase()
  const cat: ContentCategory = ExtCatMap[ext || ''] || 'unknown'
  return cat
}