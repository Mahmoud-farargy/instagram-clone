import { css } from 'styled-components';

// billabong
import billabongRegular from "./Billabong/Billabong.ttf";

// dosis
import dosisExtraLightTtf from "./Dosis/Dosis-ExtraLight.ttf";
import dosisLightTtf from "./Dosis/Dosis-Light.ttf";
import dosisRegularTtf from "./Dosis/Dosis-Regular.ttf";
import dosisMediumTtf from "./Dosis/Dosis-Medium.ttf";
import dosisSemiBoldTtf from "./Dosis/Dosis-SemiBold.ttf";
import dosisBoldTtf from "./Dosis/Dosis-Bold.ttf";
import dosisExtraBoldTtf from "./Dosis/Dosis-ExtraBold.ttf";

// raleway
import ralewayThinTtf from "./Raleway/Raleway-Thin.ttf";
import ralewasyExtralightTtf from "./Raleway/Raleway-ExtraLight.ttf";
import ralewasyLightTtf from "./Raleway/Raleway-Light.ttf";
import ralewayRegularTtf from "./Raleway/Raleway-Medium.ttf";
import ralewayMediumTtf from "./Raleway/Raleway-Regular.ttf";
import ralewaySemiboldTtf from "./Raleway/Raleway-SemiBold.ttf";
import ralewayBoldTff from "./Raleway/Raleway-Bold.ttf";
import ralewayExtraboldTtf from "./Raleway/Raleway-ExtraBold.ttf";
import ralewayHeavyTtf from "./Raleway/Raleway-Black.ttf";


// billabong weight(s)
const billabongNormalWeights = {
    400: [billabongRegular]
}

// dosis weights
const dosisNormalWeights = {
    100: [ralewayThinTtf],
    200: [dosisExtraLightTtf],
    300: [dosisLightTtf],
    400: [dosisRegularTtf],
    500: [dosisMediumTtf],
    600: [dosisSemiBoldTtf],
    700: [dosisBoldTtf],
    800: [dosisExtraBoldTtf]
}

// raleways weights
const ralewayNormalWeights = {
  100: [ralewayThinTtf],
  200: [ralewasyExtralightTtf],
  300: [ralewasyLightTtf],
  400: [ralewayRegularTtf],
  500: [ralewayMediumTtf],
  600: [ralewaySemiboldTtf],
  700: [ralewayBoldTff],
  800: [ralewayExtraboldTtf],
  900: [ralewayHeavyTtf]
}

const billabong = {
    name: "Billabong",
    normal: billabongNormalWeights
}

const raleway = {
  name: "Raleway",
  normal: ralewayNormalWeights
}

const dosis = {
    name: "Dosis",
    normal: dosisNormalWeights
}


const createFontFaces = (family, style = 'normal') => {
  let styles = '';

  for (const [weight, formats] of Object.entries(family[style])) {
    const woff = formats[0];
    const woff2 = formats[1];

    styles += `
      @font-face {
        font-family: '${family.name}';
        src: ${woff2 ? `url(${woff2}) format('woff2'),` : ''}
            url(${woff}) format('woff');
        font-weight: ${weight};
        font-style: ${style};
        font-display: swap;
      }
    `;
  }

  return styles;
};

// font faces
const billabongNormal = createFontFaces(billabong);

const ralewayNormal = createFontFaces(raleway);

const dosisNormal = createFontFaces(dosis);


const Fonts = css`
  ${ralewayNormal +
    billabongNormal + dosisNormal
  }
`;

export default Fonts;
