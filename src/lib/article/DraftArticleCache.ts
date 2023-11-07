import { PostSubmitFormat } from "@/components/types/PostSubmitFormat"

const map = new Map<string, PostSubmitFormat>()

const setDraftData = async (data: PostSubmitFormat) => {
    map.set(data.id, data)
}

const getDraftData = async (id: string) => {
    return map.get(id)
}

export { setDraftData, getDraftData }