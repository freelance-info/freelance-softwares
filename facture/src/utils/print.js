export function printToPdf() {
    const { getCurrentWindow, dialog } = window.require('@electron/remote');
    const win = getCurrentWindow();
    const fs = window.require('fs');

    // Use default printing options
    win.webContents.printToPDF({}).then(data => {

        const filePath = dialog.showSaveDialogSync(win, {
            title: 'Sauvegarde de la facture',
            filters: [{
                name: 'facture',
                defaultPath: '%USERPROFILE%/Documents',
                extensions: ['pdf']
            }]
        });

        if (filePath) { // if user cancelled, filePath is undefined
            fs.writeFile(filePath, data, (error) => {
                if (error) {
                    throw error;
                }
                console.log('Write PDF successfully.')
            });
        }



    }).catch(error => {
        console.log(error)
    })

}