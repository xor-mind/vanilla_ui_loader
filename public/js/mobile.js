// this is really apart of the UI loader.
// this function deletes all current style sheets and includes the
// app's stylesheets. this is a part of the dynamic UI handling 
// which helps separate concerns of different UIs.
function loadMobileStyles(styles = ['/css/style_mobile.css']) 
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
  
// this is application specific UI javascript. 
// the goal is to add UI functionality to the hamburger menu
// and the navbar, which will host specific flashcard functionality
function setupMobileUI() {
const hamburger = document.getElementById("hamburger-icon");
const navbar = document.getElementById("mobile-navbar");

if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
    navbar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);
    
        if (!isClickInsideNav && !isClickOnHamburger && navbar.classList.contains("open")) {
            navbar.classList.remove("open");
        }
    });
}
}

loadMobileStyles(['/css/style_mobile.css']);
setupMobileUI();
