// this is really apart of the UI loader.
// this function deletes all current style sheets and includes the
// app's stylesheets. this is a part of the dynamic UI handling 
// which helps separate concerns of different UIs.
function loadDesktopStyles(styles = ['/css/style_desktop.css']) 
{
    // delete all style sheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());

    // add our style sheets
styles.forEach(href => {
    const id = href.split('/').pop().replace(/\.[^/.]+$/, '').replace(/_/g, '-');
    if (!document.getElementById(`style-${id}`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = `style-${id}`;
    document.head.appendChild(link);
    }
});
}

loadDesktopStyles(['/css/style_desktop.css']);