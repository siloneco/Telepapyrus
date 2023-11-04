export type TabState = 'write' | 'preview'

export type SwitchEventCallback = {
    key: string,
    fn: () => Promise<void>,
}

export type TabContextProps = {
    active: TabState,
    setActive: (_tab: TabState) => void,
    setContent: (_content: string) => void,
    registerOnMount: (_key: TabState, _fn: () => Promise<void>) => void,
}

export type IUseDraftWorkspace = {
    title: string,
    setTitle: (_title: string) => void,
    content: string,
    activeTab: string,
    switchTab: (_tab: TabState) => Promise<void>,
    tabContextProviderValue: TabContextProps
}