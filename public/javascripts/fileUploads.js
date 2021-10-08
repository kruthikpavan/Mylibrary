FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)


FilePond.setOptions({
    stylePanelAspectRatio:150/100,
    imageResizeTargetWidth:100,
    imageResizeTargetHeight:160
})
FilePond.parse(document.body)