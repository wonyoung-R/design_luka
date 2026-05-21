// Shared hero-scroll constants for HomePage + Navbar.
// Kept in one place so the navbar's grid-visibility threshold stays in sync
// with HomePage's scroll room (previously hardcoded as 480 in two files).
//
// SCROLL_RANGE  : px over which the brand text animates from hero-center to navbar.
// SPRING_SETTLE : extra px so the spring is visually settled at navbar before grid appears.
// SCROLL_ROOM   : total hero scroll room; grid top reaches viewport bottom at this scrollTop.
export const SCROLL_RANGE = 400;
export const SPRING_SETTLE = 80;
export const SCROLL_ROOM = SCROLL_RANGE + SPRING_SETTLE; // 480
