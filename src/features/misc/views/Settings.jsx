import { memo, useMemo, lazy, Suspense } from 'react';
import { useT } from 'contexts/TranslationContext';

import Tabs from 'components/Elements/MainModal/backend/Tabs';
import SettingsLoader from '../components/SettingsLoader';
import './Settings.scss';

const NavbarOptions = lazy(() => import('features/navbar').then((m) => ({ default: m.NavbarOptions })));
const GreetingOptions = lazy(() => import('features/greeting').then((m) => ({ default: m.GreetingOptions })));
const TimeOptions = lazy(() => import('features/time').then((m) => ({ default: m.TimeOptions })));
const DateOptions = lazy(() => import('features/time').then((m) => ({ default: m.DateOptions })));
const QuickLinksOptions = lazy(() => import('features/quicklinks').then((m) => ({ default: m.QuickLinksOptions })));
const QuoteOptions = lazy(() => import('features/quote').then((m) => ({ default: m.QuoteOptions })));
const MessageOptions = lazy(() => import('features/message').then((m) => ({ default: m.MessageOptions })));
const BackgroundOptions = lazy(() => import('features/background').then((m) => ({ default: m.BackgroundOptions })));
const SearchOptions = lazy(() => import('features/search').then((m) => ({ default: m.SearchOptions })));
const WeatherOptions = lazy(() => import('features/weather').then((m) => ({ default: m.WeatherOptions })));
const Stats = lazy(() => import('features/stats').then((m) => ({ default: m.Stats })));
const About = lazy(() => import('../sections').then((m) => ({ default: m.About })));
const AdvancedOptions = lazy(() => import('../sections').then((m) => ({ default: m.AdvancedOptions })));
const AppearanceOptions = lazy(() => import('../sections').then((m) => ({ default: m.AppearanceOptions })));
const Changelog = lazy(() => import('../sections').then((m) => ({ default: m.Changelog })));
const ExperimentalOptions = lazy(() => import('../sections').then((m) => ({ default: m.ExperimentalOptions })));
const LanguageOptions = lazy(() => import('../sections').then((m) => ({ default: m.LanguageOptions })));
const Overview = lazy(() => import('../sections').then((m) => ({ default: m.Overview })));

const sections = [
  { label: 'modals.main.settings.sections.order.title', name: 'order', component: Overview },
  {
    label: 'modals.main.settings.sections.appearance.navbar.title',
    name: 'navbar',
    component: NavbarOptions,
  },
  {
    label: 'modals.main.settings.sections.greeting.title',
    name: 'greeting',
    component: GreetingOptions,
  },
  { label: 'modals.main.settings.sections.time.title', name: 'time', component: TimeOptions },
  {
    label: 'modals.main.settings.sections.quicklinks.title',
    name: 'quicklinks',
    component: QuickLinksOptions,
  },
  { label: 'modals.main.settings.sections.quote.title', name: 'quote', component: QuoteOptions },
  { label: 'modals.main.settings.sections.date.title', name: 'date', component: DateOptions },
  {
    label: 'modals.main.settings.sections.message.title',
    name: 'message',
    component: MessageOptions,
  },
  {
    label: 'modals.main.settings.sections.background.title',
    name: 'background',
    component: BackgroundOptions,
  },
  { label: 'modals.main.settings.sections.search.title', name: 'search', component: SearchOptions },
  {
    label: 'modals.main.settings.sections.weather.title',
    name: 'weather',
    component: WeatherOptions,
  },
  {
    label: 'modals.main.settings.sections.appearance.title',
    name: 'appearance',
    component: AppearanceOptions,
  },
  {
    label: 'modals.main.settings.sections.language.title',
    name: 'language',
    component: LanguageOptions,
  },
  {
    label: 'modals.main.settings.sections.advanced.title',
    name: 'advanced',
    component: AdvancedOptions,
  },
  { label: 'modals.main.settings.sections.stats.title', name: 'stats', component: Stats },
  {
    label: 'modals.main.settings.sections.experimental.title',
    name: 'experimental',
    component: ExperimentalOptions,
  },
  {
    label: 'modals.main.settings.sections.changelog.title',
    name: 'changelog',
    component: Changelog,
  },
  { label: 'modals.main.settings.sections.about.title', name: 'about', component: About },
];

function Settings(props) {
  const t = useT();

  const translatedSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        translatedLabel: t(section.label),
      })),
    [t],
  );

  return (
    <Tabs
      changeTab={(type) => props.changeTab(type)}
      current="settings"
      currentTab={props.currentTab}
      onSectionChange={props.onSectionChange}
      onSubSectionChange={props.onSubSectionChange}
      currentSubSection={props.currentSubSection}
      deepLinkData={props.deepLinkData}
      navigationTrigger={props.navigationTrigger}
      sections={sections}
    >
      {translatedSections.map(({ label, name, component: Component, translatedLabel }) => (
        <div key={name} label={translatedLabel} name={name}>
          <Suspense fallback={<SettingsLoader />}>
            <div className="settings-content-wrapper">
              <Component
                currentSubSection={props.currentSubSection}
                onSubSectionChange={props.onSubSectionChange}
                sectionName={name}
              />
            </div>
          </Suspense>
        </div>
      ))}
    </Tabs>
  );
}

export default memo(Settings);
