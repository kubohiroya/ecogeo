const CITY_SVGDATA_OBJECT = `<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-kaxv2e" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DomainIcon"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></svg>`;
const CITY_SVGDATA_BLOB = new Blob([CITY_SVGDATA_OBJECT], {
  type: 'image/svg+xml',
});
export const CITY_SVGDATA_URL = URL.createObjectURL(CITY_SVGDATA_BLOB);
