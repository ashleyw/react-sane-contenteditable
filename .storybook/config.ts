/* eslint-disable import/no-commonjs */

import { DocsContainer, DocsPage } from '@storybook/addon-docs/blocks';
import { withTests } from '@storybook/addon-jest';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';

addParameters({
  options: {
    showNav: true,
    showPanel: true,
    panelPosition: 'bottom',
    isToolshown: true,
  },
});

addParameters({
  docsContainer: DocsContainer,
  docs: DocsPage,
});

addDecorator(withSmartKnobs);
addDecorator(
  // @ts-ignore
  withKnobs({
    escapeHTML: false,
  }),
);

addDecorator(
  //@ts-ignore
  withTests({
    results: require('../.jest-output.json') as string,
    filesExt: '.test.tsx?$',
  }),
);

configure(require.context('../src', true, /\.stories\.(mdx|tsx|jsx)$/), module);
