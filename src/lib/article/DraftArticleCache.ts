const map = new Map<string, string>()

const setDraftData = async (key: string, data: string) => {
    map.set(key, data)
}

const getDraftData = async (key: string) => {
    return map.get(key)
}

export { setDraftData, getDraftData }