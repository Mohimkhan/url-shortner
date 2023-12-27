// variables
const contentSections = document.querySelectorAll('.content');
const shield = document.querySelector('.shield');
const seeMoreButtons = document.querySelectorAll('.btn-more');

let initialHeight = 0;
let initialTopValue;

// looping over all content sections
contentSections.forEach((content) => {
    // element with the class of 'links'
    const linkContainer = content.children[2];
    // select all the element (with the class 'link-details') execept the first element (with the class 'sheield')
    const numberOfLinks = linkContainer.children.length - 1;
    
    // checking if the link container has more than one link
    if (numberOfLinks > 1) {
        // displaying the shield and calculating initial heights
        const shieldElement = linkContainer.children[0];
        shieldElement.classList.remove('hidden');

        const firstLinkHeight = linkContainer.children[1].offsetHeight;
        const secondLinkHeight = linkContainer.children[2].offsetHeight;

        initialTopValue = Math.round((firstLinkHeight + secondLinkHeight) * 0.45);
        initialHeight = Math.round((firstLinkHeight + secondLinkHeight));

        linkContainer.style.height = `${initialHeight * 0.85}px`;
        shieldElement.style.height = `${initialHeight / 3}px`;
    }
});

// event handling for 'see more' buttons
seeMoreButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const clickedButton = e.currentTarget;
        const linkContainer = e.target.parentElement.parentElement;
        const links = [...linkContainer.children];
        let maxHeight = 0;
        const gapBetweenLinks = 15;
        const shieldElement = e.target.parentElement;

        shieldElement.classList.toggle('reset');

        if (shieldElement.classList.contains('reset')) {
            // expanding the link container and updating button text
            clickedButton.textContent = 'see less..';

            links.forEach((link) => {
                if (link.classList.contains('link-details')) {
                    maxHeight += link.offsetHeight + gapBetweenLinks + 10;
                }
            });

            linkContainer.style.height = `${maxHeight}px`;
        } else {
            // collapsing the link container and updating button text
            clickedButton.textContent = 'see more..';
            linkContainer.style.height = `${initialHeight * 0.85}px`;
        }
    });
});
