import {
    DUIButton,
    DUINavigationButton,
    SourceStateManager
} from '@paperback/types'

export const getImageServer = async (stateManager: SourceStateManager): Promise<string[]> => {
    return (await stateManager.retrieve('image_server') as string[]) ?? ['server1']
}

export const chapterSettings = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'chapter_settings',
        label: 'Chapter Settings',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    id: 'image_server_settings',
                    header: 'Image Server Settings',
                    isHidden: false,
                    rows: async () => [
                        App.createDUISelect({
                            id: 'image_server',
                            label: 'Image Server',
                            options: ['server1', 'server2'],
                            value: App.createDUIBinding({
                                get: () => getImageServer(stateManager),
                                set: async (newValue) => await stateManager.store('image_server', newValue)
                            }),
                            allowsMultiselect: false,
                            labelResolver: async (value: string) => (value == 'server1' ? 'Server 1' : 'Server 2')
                        })
                    ]
                })
            ]
        })
    })
}

export const resetSettings = (stateManager: SourceStateManager): DUIButton => {
    return App.createDUIButton({
        id: 'reset',
        label: 'Reset to Default',
        onTap: async () => await stateManager.store('image_server', null)
    })
}
