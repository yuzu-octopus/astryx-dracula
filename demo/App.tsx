import { useState } from 'react';
import { Divider, Heading, Tab, TabList, Text, VStack } from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxStylesTheme } from '../astryx-theme';
import { Overview } from './Overview';
import { ComponentGallery } from './Components';
import { Dashboard } from './Dashboard';
import { Quickstart } from './Quickstart';

export default function App() {
  const [tab, setTab] = useState('overview');
  return (
    <Theme theme={astryxStylesTheme} mode="dark">
      <VStack>
        <Heading level={1}>Astryx Dracula</Heading>
        <Text>Pure Dracula brand kit for every Astryx site. Dark-only, 11 frozen hexes, zero runtime theme cost.</Text>
        <TabList value={tab} onChange={setTab} layout="fill" hasDivider>
          <Tab value="overview" label="Overview" />
          <Tab value="components" label="Components" />
          <Tab value="dashboard" label="Dashboard" />
          <Tab value="quickstart" label="Quickstart" />
        </TabList>
        {tab === 'overview' && <Overview go={setTab} />}
        {tab === 'components' && <ComponentGallery />}
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'quickstart' && <Quickstart />}
        <Divider />
        <Text>Copy the kit from ~/Documents/Projects/astryx-styles. Read the skill before styling anything.</Text>
      </VStack>
    </Theme>
  );
}
