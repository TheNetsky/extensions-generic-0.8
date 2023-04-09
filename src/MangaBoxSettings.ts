import {
    DUINavigationButton,
    SourceStateManager,
} from '@paperback/types'

export const getImageServer = async (stateManager: SourceStateManager): Promise<string> => {
    return ((await stateManager.retrieve('imageServer')) as string) ?? 'server1'
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
                            id: 'imageServer',
                            label: 'Image Server',
                            options: ['server1', 'server2'],
                            value: App.createDUIBinding({
                                get: () => getImageServer(stateManager).then(value => [value[0]]),
                                set: async (newValue) => await stateManager.store('imageServer', newValue)
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