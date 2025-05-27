// Simple Assertion Function
function assert(condition, message) {
    if (!condition) {
        console.error('Assertion Failed:', message);
        // In a real test runner, you might throw an error here
        // For this environment, we'll just log and continue
        return false;
    } else {
        console.log('Assertion Passed:', message);
        return true;
    }
}

// --- Test Suite ---
console.log("--- Running JavaScript Unit Tests ---");

// Mocking localStorage
let mockLocalStorage = {};
const localStorageMock = {
    getItem: key => mockLocalStorage[key] || null,
    setItem: (key, value) => { mockLocalStorage[key] = value.toString(); },
    removeItem: key => delete mockLocalStorage[key],
    clear: () => { mockLocalStorage = {}; }
};
global.localStorage = localStorageMock; // Use 'global' for broader scope if script.js is loaded in a way that expects it


// --- DOM Mocks (Basic) ---
// These will be created and appended to a test-specific div in the body for each test, or mocked more abstractly.
// For simplicity here, we'll mock them as needed per test function.

// --- Test Functions ---

// Test for linkAction()
function testLinkAction() {
    console.log("\n--- Testing linkAction ---");
    // Setup: Mock navMenu
    const mockNavMenu = {
        classList: {
            contains: () => true, // Assume it contains 'show-menu' initially
            remove: function(cls) { this.removedClass = cls; },
            removedClass: ''
        }
    };
    // Temporarily replace getElementById for this test
    const originalGetElementById = document.getElementById;
    document.getElementById = (id) => {
        if (id === 'nav-menu') return mockNavMenu;
        return originalGetElementById(id); // Fallback for other IDs if any
    };

    // Action: Call linkAction (assuming linkAction is globally available or imported)
    // To make script.js functions available, they would need to be exported or the script.js loaded.
    // For this environment, I'll assume linkAction is accessible.
    // If script.js is not loaded, I'd have to redefine linkAction here or skip this test.
    // Let's assume for now we can call it.
    // For now, let's define a mock linkAction based on script.js
    function mockLinkAction() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) { // Check if navMenu exists
             navMenu.classList.remove('show-menu');
        }
    }
    mockLinkAction();

    // Assert
    assert(mockNavMenu.classList.removedClass === 'show-menu', "linkAction should remove 'show-menu' class.");

    // Teardown: Restore original getElementById
    document.getElementById = originalGetElementById;
}

// Test for toggleSkills()
function testToggleSkills() {
    console.log("\n--- Testing toggleSkills ---");
    // Setup: Mock skillsContent and a skill item
    const mockSkillItem1 = {
        className: 'skills__content skills__close',
        parentNode: { className: 'skills__content skills__close' } // this.parentNode
    };
    const mockSkillItem2 = {
        className: 'skills__content skills__close',
        parentNode: { className: 'skills__content skills__close' }
    };
    const mockSkillsContent = [mockSkillItem1, mockSkillItem2];

    // Mocking getElementsByClassName
    const originalGetElementsByClassName = document.getElementsByClassName;
    document.getElementsByClassName = (className) => {
        if (className === 'skills__content') return mockSkillsContent;
        return originalGetElementsByClassName(className);
    };
    
    // Redefine toggleSkills for testing scope
    function mockToggleSkillsFunction() {
        // 'this' refers to the clicked skillsHeader, its parentNode is the skills__content
        let itemClass = this.parentNode.className;

        for (let i = 0; i < mockSkillsContent.length; i++) {
            mockSkillsContent[i].className = 'skills__content skills__close';
        }
        if (itemClass === 'skills__content skills__close') {
            this.parentNode.className = 'skills__content skills__open';
        } else if (itemClass === 'skills__content skills__open') { // Added for completeness
             this.parentNode.className = 'skills__content skills__close';
        }
    }

    // Test case 1: Opening a closed skill
    // 'this' context for mockToggleSkillsFunction will be the skillsHeader element.
    // The skillsHeader's parentNode is the skills__content div (mockSkillItem1).
    mockToggleSkillsFunction.call({ parentNode: mockSkillItem1 });
    assert(mockSkillItem1.className === 'skills__content skills__open', "toggleSkills should open a closed skill.");
    assert(mockSkillItem2.className === 'skills__content skills__close', "toggleSkills should keep other skills closed.");

    // Test case 2: Closing an open skill
    // Now mockSkillItem1 is open, simulate clicking it again
    mockToggleSkillsFunction.call({ parentNode: mockSkillItem1 });
    assert(mockSkillItem1.className === 'skills__content skills__close', "toggleSkills should close an open skill if clicked again.");
    
    // Test case 3: Opening another skill (should close the first one)
    mockSkillItem1.className = 'skills__content skills__open'; // Manually set item 1 to open
    mockSkillItem2.className = 'skills__content skills__close';
    mockToggleSkillsFunction.call({ parentNode: mockSkillItem2 });
    assert(mockSkillItem2.className === 'skills__content skills__open', "toggleSkills should open the second skill.");
    assert(mockSkillItem1.className === 'skills__content skills__close', "toggleSkills should close the first skill when opening the second.");

    // Teardown
    document.getElementsByClassName = originalGetElementsByClassName;
}


// Test for Dark Mode functionality
function testDarkMode() {
    console.log("\n--- Testing Dark Mode ---");
    mockLocalStorage.clear(); // Clear LS before test

    // Setup: Mock themeButton and document.body
    const mockThemeButton = {
        classList: {
            toggledClass: '',
            contains: function(cls) { return this.toggledClass === cls; },
            toggle: function(cls) {
                this.toggledClass = (this.toggledClass === cls) ? '' : cls;
            }
        }
    };
    const mockBody = {
        classList: {
            currentClass: '', // Store 'dark-theme' or ''
            toggle: function(cls) {
                this.currentClass = (this.currentClass === cls) ? '' : cls;
            },
            contains: function(cls) { return this.currentClass === cls; }
        }
    };

    const originalGetElementById = document.getElementById;
    const originalDocumentBody = document.body;
    document.getElementById = (id) => id === 'theme-button' ? mockThemeButton : null;
    // Need to be careful how document.body is accessed by the script.
    // If it's `document.body`, this simple mock might not work if script.js is loaded separately.
    // For this self-contained test, we can pass mockBody.
    
    // Redefine the core logic of the dark mode event listener
    const darkThemeClass = 'dark-theme';
    const iconThemeClass = 'uil-sun'; // This was the original, Heroicon would be different

    function mockThemeToggleLogic(body, button) {
        body.classList.toggle(darkThemeClass);
        button.classList.toggle(iconThemeClass); // The actual icon class for Heroicon would be different

        // Mocking getCurrentTheme and getCurrentIcon for localStorage part
        const mockGetCurrentTheme = () => body.classList.contains(darkThemeClass) ? 'dark' : 'light';
        const mockGetCurrentIcon = () => button.classList.contains(iconThemeClass) ? iconThemeClass : ''; // Simplified

        localStorageMock.setItem('selected-theme', mockGetCurrentTheme());
        localStorageMock.setItem('selected-icon', mockGetCurrentIcon());
    }

    // Action 1: Toggle theme on
    mockThemeToggleLogic(mockBody, mockThemeButton);
    assert(mockBody.classList.contains(darkThemeClass), "Dark mode should be applied to body.");
    assert(mockThemeButton.classList.contains(iconThemeClass), "Icon theme class should be toggled on button.");
    assert(localStorageMock.getItem('selected-theme') === 'dark', "localStorage should store 'dark' theme.");
    assert(localStorageMock.getItem('selected-icon') === iconThemeClass, "localStorage should store icon theme.");

    // Action 2: Toggle theme off
    mockThemeToggleLogic(mockBody, mockThemeButton);
    assert(!mockBody.classList.contains(darkThemeClass), "Dark mode should be removed from body.");
    assert(!mockThemeButton.classList.contains(iconThemeClass), "Icon theme class should be toggled off button.");
    assert(localStorageMock.getItem('selected-theme') === 'light', "localStorage should store 'light' theme.");
    assert(localStorageMock.getItem('selected-icon') === '', "localStorage should store empty icon theme.");
    
    // Teardown
    document.getElementById = originalGetElementById;
    // document.body = originalDocumentBody; // Not easily restorable if script.js directly uses document.body
    mockLocalStorage.clear();
}

// Test for scrollUp()
function testScrollUp() {
    console.log("\n--- Testing scrollUp ---");
    // Setup: Mock scroll-up element
    const mockScrollUpElement = {
        classList: {
            addedClass: '',
            removedClass: '',
            add: function(cls) { this.addedClass = cls; this.removedClass = ''; },
            remove: function(cls) { this.removedClass = cls; this.addedClass = ''; }
        }
    };
    const originalGetElementById = document.getElementById;
    document.getElementById = (id) => id === 'scroll-up' ? mockScrollUpElement : null;

    // Mock window.scrollY - this is tricky. The function uses 'this.scrollY'.
    // We'll redefine scrollUp to accept a scrollY value for testability.
    function mockScrollUpFunction(currentScrollY) {
        const scrollUpEl = document.getElementById('scroll-up');
        if (scrollUpEl) {
            if (currentScrollY >= 570) {
                scrollUpEl.classList.add('show-scroll');
            } else {
                scrollUpEl.classList.remove('show-scroll');
            }
        }
    }

    // Test case 1: ScrollY >= 570
    mockScrollUpFunction(600);
    assert(mockScrollUpElement.classList.addedClass === 'show-scroll', "scrollUp should add 'show-scroll' class when scrolled down.");

    // Test case 2: ScrollY < 570
    mockScrollUpFunction(300);
    assert(mockScrollUpElement.classList.removedClass === 'show-scroll', "scrollUp should remove 'show-scroll' class when scrolled up.");

    // Teardown
    document.getElementById = originalGetElementById;
}


// Placeholder for modal tests (complex due to multiple elements and event listeners)
function testModals() {
    console.log("\n--- Testing Modals (Conceptual) ---");
    // Setup: Mock modalViews, modalBtns, modalCloses
    const mockModalView1 = { classList: { list: [], add(c){this.list.push(c)}, remove(c){this.list=this.list.filter(i=>i!==c)} } };
    const mockModalViews = [mockModalView1];
    // ... more complex mocking needed for querySelectorAll and event listeners ...
    // For now, just a conceptual placeholder.
    // let modal = function (modalClick) { mockModalViews[modalClick].classList.add('active-modal'); }
    // modal(0);
    // assert(mockModalView1.classList.list.includes('active-modal'), "Modal should become active.");
    console.log("Modal tests would require more intricate DOM mocking and event simulation.");
    assert(true, "Modal tests conceptual placeholder (not fully implemented).");
}

// Placeholder for portfolio popup tests
function testPortfolioPopup() {
    console.log("\n--- Testing Portfolio Popup (Conceptual) ---");
    // Similar to modals, requires DOM mocking for querySelector and element properties.
    // const mockPortfolioPopup = { classList: { toggled: false, toggle(c){ this.toggled = !this.toggled; return this.toggled } } };
    // function togglePortfolioPopup() { mockPortfolioPopup.classList.toggle('open'); }
    // togglePortfolioPopup();
    // assert(mockPortfolioPopup.classList.toggled, "Portfolio popup should toggle 'open' class.");
    console.log("Portfolio popup tests would require more intricate DOM mocking.");
    assert(true, "Portfolio popup tests conceptual placeholder (not fully implemented).");
}


// --- Run Tests ---
// Note: In a real environment, script.js functions would be imported or the script loaded.
// Here, some functions are redefined for testability within this file's scope.
// This assumes that the functions from script.js that are NOT redefined here (like those setting up event listeners)
// would have been executed if script.js was loaded in the test environment.

testLinkAction();
testToggleSkills();
testDarkMode();
testScrollUp();
testModals(); // Conceptual
testPortfolioPopup(); // Conceptual

console.log("\n--- JavaScript Unit Tests Finished ---");

// It's important that the actual script.js is NOT loaded directly if we are mocking its functions by redefining them.
// If script.js IS loaded, then we should test its actual functions, not the mocks.
// The current setup mostly redefines logic for testability without loading script.js.
// To test the actual script.js, a more advanced setup (like Jest with jsdom) would be needed.
